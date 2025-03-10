import { useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { average, calculatePlayerStats, getItemSetCounts, getItemTableItems, getPlayerHitPercent, getStdev, ItemSlotKeyToItemSlot, random } from "../Common";
import { Gems } from "../data/Gems";
import { Items } from "../data/Items";
import { RootState } from "../redux/Store"
import { clearSavedItemSlotDps, setCombatLogBreakdownValue, setCombatLogData, setCombatLogVisibility, setHistogramData, setHistogramVisibility, setSavedItemDps, setSimulationInProgressStatus, setStatWeightValue, setStatWeightVisibility } from "../redux/UiSlice";
import { SimWorker } from "../SimWorker.js";
import { CombatLogBreakdownData, GemColor, ItemAndEnchantStruct, ItemSlot, PlayerState, SelectedGemsStruct, SimulationType, Stat, StatConstant, StatWeightStats, WorkerParams } from "../Types";

interface SimulationUpdate {
  medianDps: number,
  iteration: number,
  iterationAmount: number,
  itemId: number,
  customStat: string
}

interface SimulationEnd {
  customStat: string,
  itemId: number,
  iterationAmount: number,
  totalDuration: number,
  maxDps: number,
  minDps: number,
  medianDps: number
}

interface IGetWorkerParams {
  itemId: number,
  equippedItemId: number,
  simulationType: SimulationType,
  randomSeed: number,
  customStat?: {
    stat: string,
    value: number
  }
}

interface ISimulationProgressPercent {
  itemId: number,
  progressPercent: number,
  customStat?: string
}

const statWeightStatIncrease = 100;
const statWeightValues: { [key: string]: number } = {
  'normal': 0,
  [Stat.stamina]: statWeightStatIncrease,
  [Stat.intellect]: statWeightStatIncrease,
  [Stat.spirit]: statWeightStatIncrease,
  [Stat.spellPower]: statWeightStatIncrease,
  [Stat.shadowPower]: statWeightStatIncrease,
  [Stat.firePower]: statWeightStatIncrease,
  [Stat.hitRating]: statWeightStatIncrease,
  [Stat.critRating]: statWeightStatIncrease,
  [Stat.hasteRating]: statWeightStatIncrease,
  [Stat.mp5]: statWeightStatIncrease,
}

function getEquippedMetaGemId(items: ItemAndEnchantStruct, gems: SelectedGemsStruct): number {
  if ([null, 0].includes(items.head) || !gems.head || !gems.head[items.head]) { return 0; }

  for (const gemArray of Object.values(gems.head[items.head])) {
    if (gemArray && Gems.find(e => e.id === gemArray[1])?.color === GemColor.Meta) {
      return gemArray[1];
    }
  }

  return 0;
}

let lastStatWeightUpdateTime: { [key: string]: number } = {};

export function SimulationButtons() {
  const playerState = useSelector((state: RootState) => state.player);
  const uiState = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch();
  const [medianDps, setMedianDps] =
    useState(localStorage.getItem('medianDps') || '');
  const [minDps, setMinDps] = useState(localStorage.getItem('minDps') || '');
  const [maxDps, setMaxDps] = useState(localStorage.getItem('maxDps') || '');
  const [simulationDuration, setSimulationDuration] =
    useState(localStorage.getItem('simulationDuration') || '');
  const [simulationProgressPercent, setSimulationProgressPercent] = useState(0);
  const [dpsStdev, setDpsStdev] = useState('');
  const [simulationType, setSimulationType] = useState(SimulationType.Normal);
  let combatLogEntries: string[] = [];

  function combatLogButtonIsDisabled(): boolean {
    return uiState.combatLog.data.length === 0;
  }

  function histogramButtonIsDisabled(): boolean {
    return uiState.histogram.data === undefined;
  }

  function getWorkerParams(params: IGetWorkerParams): WorkerParams {
    let customPlayerState: PlayerState = JSON.parse(JSON.stringify(playerState));
    let iterationAmount = parseInt(customPlayerState.settings.iterations);

    if (params.simulationType === SimulationType.StatWeights) {
      // Set minimum iteration amount to 100,000 for stat weight sims
      iterationAmount = Math.max(iterationAmount, 100000);
      // Increase the iteration amount for stat weight sims if it's not the 'normal' sim with no added stats.
      if (params.customStat?.stat !== 'normal') {
        iterationAmount += 20000;
      }
    }

    if (params.simulationType !== SimulationType.StatWeights) {
      customPlayerState
        .selectedItems[ItemSlotKeyToItemSlot(false, uiState.selectedItemSlot, uiState.selectedItemSubSlot)] =
        params.itemId;
    }

    let playerStats = calculatePlayerStats(customPlayerState);

    if (params.simulationType === SimulationType.StatWeights) {
      if (params.customStat?.stat && params.customStat.stat !== 'normal') {
        let statValue = params.customStat.value;

        if (params.customStat.stat === Stat.hitRating) {
          const hitPercent = getPlayerHitPercent(customPlayerState);
          // If the user isn't hitcapped but adding the extra hit rating would overcap them
          // then instead remove hit rating instead of adding it so it doesn't get wasted.
          // Using 15.99 instead of 16 because using 16 was causing issues when a player had 
          // e.g. 15.995 hit percent which would show as 16% in the sidebar but not technically be hit capped.
          if (hitPercent <= 15.99 &&
            hitPercent + statWeightValues[Stat.hitRating] / StatConstant.hitRatingPerPercent > StatConstant.hitPercentCap) {
            statValue *= -1;
          }
        }
        playerStats[params.customStat.stat as Stat]! += statValue;
      }
    }

    return {
      playerSettings: {
        auras: customPlayerState.auras,
        items: customPlayerState.selectedItems,
        enchants: customPlayerState.selectedEnchants,
        gems: customPlayerState.selectedGems,
        talents: customPlayerState.talents,
        rotation: customPlayerState.rotation,
        stats: playerStats,
        sets: getItemSetCounts(customPlayerState.selectedItems),
        simSettings: customPlayerState.settings,
        metaGemId: getEquippedMetaGemId(customPlayerState.selectedItems, customPlayerState.selectedGems),
      },
      simulationSettings: {
        iterations: iterationAmount,
        minTime: parseInt(customPlayerState.settings["min-fight-length"]),
        maxTime: parseInt(customPlayerState.settings['max-fight-length'])
      },
      randomSeed: params.randomSeed,
      itemId: params.itemId,
      simulationType: params.simulationType,
      itemSubSlot: uiState.selectedItemSubSlot,
      customStat: params.customStat?.stat || 'normal',
      equippedItemSimulation: params.itemId === params.equippedItemId ||
        (params.itemId === 0 && params.equippedItemId == null),
    }
  }

  function simulate(simulationParams: { type: SimulationType, itemIdsToSim?: number[] }) {
    if (uiState.simulationInProgress) { return; }
    let maxWorkers = window.navigator.hardwareConcurrency || 8; // Maximum amount of web workers that can be run concurrently.
    if (playerState.settings.maxWebWorkers && parseInt(playerState.settings.maxWebWorkers) > 0) {
      maxWorkers = parseInt(playerState.settings.maxWebWorkers);
    }
    const simulations: SimWorker[] = [];
    const itemSlot: ItemSlot = ItemSlotKeyToItemSlot(false, uiState.selectedItemSlot, uiState.selectedItemSubSlot);
    const equippedItemId = playerState.selectedItems[itemSlot];
    let simulationsFinished = 0;
    let simulationsRunning = 0;
    let simIndex = 0;
    let dpsArray: number[] = [];
    let dpsCount: { [key: string]: number } = {};
    let combatLogBreakdownArr: CombatLogBreakdownData[] = [];
    let totalManaRegenerated = 0;
    let totalDamageDone = 0;
    let spellDamageDict: { [key: string]: number } = {};
    let spellManaGainDict: { [key: string]: number } = {};
    // Used to keep track of the progress % of sims for the progress bar.
    let simulationProgressPercentages: ISimulationProgressPercent[] = [];
    let simWorkerParameters: IGetWorkerParams[] = [];
    combatLogEntries = [];
    dispatch(setSimulationInProgressStatus(true));
    setSimulationType(simulationParams.type);
    if (simulationParams.type === SimulationType.AllItems) {
      dispatch(clearSavedItemSlotDps(itemSlot));
    } else if (simulationParams.type === SimulationType.StatWeights) {
      dispatch(setStatWeightVisibility(true));
    }
    const randomSeed = random(0, 4294967295);

    if (simulationParams.type === SimulationType.StatWeights) {
      Object.entries(statWeightValues).forEach(statWeight => {
        simWorkerParameters.push({
          randomSeed: randomSeed,
          itemId: equippedItemId,
          equippedItemId: equippedItemId,
          simulationType: simulationParams.type,
          customStat: { stat: statWeight[0], value: statWeight[1] }
        });
      });
    } else if (simulationParams.itemIdsToSim) {
      simulationParams.itemIdsToSim.forEach(itemId => {
        simWorkerParameters.push({
          randomSeed: randomSeed,
          itemId: itemId,
          equippedItemId: equippedItemId,
          simulationType: simulationParams.type,
        });
      });
    }

    try {
      simWorkerParameters.forEach(simWorkerParameter => {
        simulationProgressPercentages.push({
          itemId: simWorkerParameter.itemId,
          progressPercent: 0,
          customStat: simWorkerParameter.customStat?.stat
        });
        simulations.push(new SimWorker(
          (dpsUpdate: { dps: number }) => {
            dpsArray.push(dpsUpdate.dps);
            const dps: string = Math.round(dpsUpdate.dps).toString();
            dpsCount[dps] = Math.round(dpsCount[dps]) + 1 || 1;
          },
          (combatLogVector: { name: string, damage: number, manaGain: number }) => {
            spellDamageDict[combatLogVector.name] =
              spellDamageDict[combatLogVector.name] + combatLogVector.damage || combatLogVector.damage;
            spellManaGainDict[combatLogVector.name] =
              spellManaGainDict[combatLogVector.name] + combatLogVector.manaGain || combatLogVector.manaGain;
            totalManaRegenerated += combatLogVector.manaGain;
            totalDamageDone += combatLogVector.damage;
          },
          (errorCallback: { errorMsg: string }) => {
            populateCombatLog();
            errorCallbackHandler(errorCallback);
          },
          (combatLogUpdate: { combatLogEntry: string }) => {
            combatLogEntries.push(combatLogUpdate.combatLogEntry);
          },
          (combatLogBreakdown: CombatLogBreakdownData) => {
            combatLogBreakdownArr.push(combatLogBreakdown);
          },
          (params: SimulationEnd) => {
            const newMedianDps = params.medianDps;
            simulationsFinished++;
            findSimulationProgressPercentObject({
              simulationProgressPercentages: simulationProgressPercentages,
              simType: simulationParams.type,
              itemId: params.itemId,
              stat: params.customStat
            }).progressPercent = 100;

            if (simulationParams.type !== SimulationType.StatWeights || params.customStat === 'normal') {
              setSavedItemDpsValue(itemSlot, params.itemId, newMedianDps, true);
            }

            // Callback for the currently equipped item
            if (simulationParams.type === SimulationType.Normal ||
              (simulationParams.type === SimulationType.AllItems && params.itemId === equippedItemId) ||
              (simulationParams.type === SimulationType.StatWeights && params.customStat === 'normal')) {
              const newMinDps = Math.round(params.minDps * 100) / 100;
              const newMaxDps = Math.round(params.maxDps * 100) / 100;
              setNewMedianDps(newMedianDps.toString(), true);
              setNewMinDps(newMinDps.toString(), true);
              setNewMaxDps(newMaxDps.toString(), true);
            }

            if (simulationParams.type === SimulationType.StatWeights) {
              updateStatWeightValue(params.customStat, newMedianDps, true);
            }

            if (simulationsFinished === simWorkerParameters.length) {
              dispatch(setSimulationInProgressStatus(false));
              const totalSimDuration = (performance.now() - startTime) / 1000;
              setNewSimulationDuration((Math.round(totalSimDuration * 10000) / 10000).toString(), true);
              setSimulationProgressPercent(0);

              // Either normal sim or multi-item sim
              if ([SimulationType.Normal, SimulationType.AllItems].includes(simulationParams.type)) {
                populateCombatLog();
              }

              if (simulationParams.type === SimulationType.Normal) {
                setDpsStdev(Math.round(getStdev(dpsArray)).toString());
                dispatch(setHistogramData(dpsCount));

                if (playerState.settings["automatically-open-sim-details"] === 'yes') {
                  dispatch(setCombatLogBreakdownValue({
                    totalDamageDone: totalDamageDone,
                    totalManaGained: totalManaRegenerated,
                    totalSimulationFightLength: params.totalDuration,
                    totalIterationAmount: params.iterationAmount,
                    spellDamageDict: spellDamageDict,
                    spellManaGainDict: spellManaGainDict,
                    data: combatLogBreakdownArr,
                  }));
                  jQuery('.breakdown-table').trigger('update');
                }
              }
            }
            else if (simulationParams.type === SimulationType.AllItems) {
              if (simulationsRunning - simulationsFinished < maxWorkers &&
                simIndex < simulations.length) {
                simulations[simIndex++].start();
                simulationsRunning++;
              }
            }
          },
          (params: SimulationUpdate) => {
            let newMedianDps = params.medianDps;
            const simProgressPercent = Math.ceil((params.iteration / params.iterationAmount) * 100);
            findSimulationProgressPercentObject({
              simulationProgressPercentages: simulationProgressPercentages,
              simType: simulationParams.type,
              itemId: params.itemId,
              stat: params.customStat
            }).progressPercent = simProgressPercent;
            setSimulationProgressPercent(Math.round(average(simulationProgressPercentages
              .map(e => e.progressPercent))));
            // Only update the item table dps value for every 10% of progress
            // because otherwise the simulation slows down too much.
            if (simulationParams.type === SimulationType.Normal ||
              (simulationParams.type === SimulationType.AllItems && simProgressPercent % 10 === 0)) {
              const domElement = document.getElementById(params.itemId.toString());
              if (domElement) {
                domElement.innerHTML = (Math.round(newMedianDps * 100) / 100).toString();
                jQuery('#item-selection-table').trigger('update');
              }
            }
            if (simulationParams.type === SimulationType.Normal ||
              (simulationParams.type === SimulationType.AllItems && params.itemId === equippedItemId) ||
              (simulationParams.type === SimulationType.StatWeights && params.customStat === 'normal')) {
              setNewMedianDps(newMedianDps.toString(), false);
            } else if (simulationParams.type === SimulationType.StatWeights) {
              // Limit the updates to once every 5 seconds
              const dateNow = Date.now();
              if (!lastStatWeightUpdateTime[params.customStat] ||
                dateNow - lastStatWeightUpdateTime[params.customStat] > 5000) {
                updateStatWeightValue(params.customStat, params.medianDps, false);
                lastStatWeightUpdateTime[params.customStat] = dateNow;
              }
            }
          },
          getWorkerParams({
            randomSeed: randomSeed,
            itemId: simWorkerParameter.itemId,
            equippedItemId: simWorkerParameter.equippedItemId,
            simulationType: simWorkerParameter.simulationType,
            customStat: simWorkerParameter.customStat,
          })
        ));
      });

      const startTime = performance.now();
      while ((simulationsRunning < maxWorkers ||
        simulationParams.type === SimulationType.StatWeights) &&
        simIndex < simulations.length) {
        simulations[simIndex++].start();
        simulationsRunning++;
      }
    } catch (error) {
      dispatch(setSimulationInProgressStatus(false));
      throw new Error("Error when trying to run simulation. " + error);
    }
  }

  function updateStatWeightValue(stat: string, value: number, finalStatWeightUpdate: boolean): void {
    let dpsDifference =
      Math.abs(Math.round(((value - Number(medianDps)) / statWeightStatIncrease) * 1000) / 1000);
    if (dpsDifference < 0.05) {
      dpsDifference = 0;
    }

    dispatch(setStatWeightValue({
      stat: stat as unknown as [keyof StatWeightStats],
      value: dpsDifference
    }));
  }

  function findSimulationProgressPercentObject(params: {
    simulationProgressPercentages: ISimulationProgressPercent[],
    simType: SimulationType,
    itemId: number,
    stat: string
  }): ISimulationProgressPercent {
    return params.simulationProgressPercentages
      .find(e =>
        (e.itemId === params.itemId && params.simType !== SimulationType.StatWeights) ||
        (e.customStat === params.stat))!
  }

  function setSavedItemDpsValue(itemSlot: ItemSlot, itemId: number, newMedianDps: number, saveToLocalStorage: boolean): void {
    dispatch(setSavedItemDps({
      itemSlot: itemSlot,
      itemId: itemId,
      dps: newMedianDps,
      saveLocalStorage: saveToLocalStorage
    }));
  }

  function populateCombatLog(): void {
    dispatch(setCombatLogData(combatLogEntries));
  }

  function errorCallbackHandler(errorCallback: { errorMsg: string }): void {
    alert("Error: " + errorCallback.errorMsg + "\nPost in #tbc-sim-report on the TBC Warlock Discord or contact Kristofer#8003 on Discord.");
  }

  function setNewMedianDps(newMedianDps: string, savingLocalStorage: boolean) {
    setMedianDps(newMedianDps);
    if (savingLocalStorage) {
      localStorage.setItem('medianDps', newMedianDps);
    }
  }

  function setNewMinDps(newMinDps: string, savingLocalStorage: boolean) {
    setMinDps(newMinDps);
    if (savingLocalStorage) {
      localStorage.setItem('minDps', newMinDps);
    }
  }

  function setNewMaxDps(newMaxDps: string, savingLocalStorage: boolean) {
    setMaxDps(newMaxDps);
    if (savingLocalStorage) {
      localStorage.setItem('maxDps', newMaxDps);
    }
  }

  function setNewSimulationDuration(newSimulationDuration: string, savingLocalStorage: boolean) {
    setSimulationDuration(newSimulationDuration);
    if (savingLocalStorage) {
      localStorage.setItem('simulationDuration', newSimulationDuration);
    }
  }

  return (
    <>
      {
        medianDps.length > 0 &&
        <div id="sim-result-dps-div">
          <p>
            <span id="median-dps">
              {
                Math.round(Number(medianDps) * 100) / 100
              }
            </span>
            <span> DPS</span> <span id="dps-stdev">{dpsStdev.length > 0 ? '±' + dpsStdev : ''}</span>
          </p>
          {
            maxDps.length > 0 && minDps.length > 0 &&
            <p>Min: <span id="min-dps">{minDps}</span> Max: <span id="max-dps">{maxDps}</span></p>
          }
        </div>
      }
      <div
        className='warlock-btn active-btn'
        onClick={() => simulate({
          itemIdsToSim: [
            Items
              .find(e =>
                e.id === playerState.selectedItems[ItemSlotKeyToItemSlot(false, uiState.selectedItemSlot, uiState.selectedItemSubSlot)])?.id || 0
          ],
          type: SimulationType.Normal
        })}
        style={{
          background: uiState.simulationInProgress && simulationType === SimulationType.Normal ?
            `linear-gradient(to right, #9482C9 ${simulationProgressPercent}%, transparent ${simulationProgressPercent}%)` : ''
        }}
      >{
          uiState.simulationInProgress && simulationType === SimulationType.Normal ?
            `${simulationProgressPercent}%` : 'Simulate'
        }
      </div>
      <div
        className='warlock-btn active-btn'
        onClick={() => simulate({
          itemIdsToSim: getItemTableItems(uiState.selectedItemSlot,
            uiState.selectedItemSubSlot,
            playerState.selectedItems,
            uiState.sources,
            uiState.hiddenItems,
            false,
            uiState.savedItemDps,
            true)
            .map(item => item.id),
          type: SimulationType.AllItems
        })}
        style={{
          background: uiState.simulationInProgress && simulationType === SimulationType.AllItems ?
            `linear-gradient(to right, #9482C9 ${simulationProgressPercent}%, transparent ${simulationProgressPercent}%)` : ''
        }}
      >{
          uiState.simulationInProgress && simulationType === SimulationType.AllItems ?
            `${simulationProgressPercent}%` : 'Simulate All Items'
        }
      </div>
      <div
        className='warlock-btn active-btn'
        onClick={() => simulate({ type: SimulationType.StatWeights })}
        style={{
          background: uiState.simulationInProgress && simulationType === SimulationType.StatWeights ?
            `linear-gradient(to right, #9482C9 ${simulationProgressPercent}%, transparent ${simulationProgressPercent}%)` : ''
        }}
      >{
          uiState.simulationInProgress && simulationType === SimulationType.StatWeights ?
            `${simulationProgressPercent}%` : 'Stat Weights'
        }
      </div>
      {
        <div
          className={'warlock-btn' + (combatLogButtonIsDisabled() ? ' disabled-btn' : ' active-btn')}
          onClick={() => !combatLogButtonIsDisabled() && dispatch(setCombatLogVisibility(!uiState.combatLog.visible))}
        >Combat Log</div>
      }
      {
        <div
          className={'warlock-btn' + (histogramButtonIsDisabled() ? ' disabled-btn' : ' active-btn')}
          onClick={() => !histogramButtonIsDisabled() && dispatch(setHistogramVisibility(!uiState.histogram.visible))}
        >Histogram</div>
      }
      <p id="sim-length-result">
        {simulationDuration.length > 0 ? simulationDuration + 's' : ''}
      </p>
    </>
  )
}