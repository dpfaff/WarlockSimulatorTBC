import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux"
import { getBaseStats, isPetActive } from "../Common";
import { Races } from "../data/Races";
import { modifySettingValue, setBaseStats } from "../redux/PlayerSlice";
import { RootState } from "../redux/Store"
import { PetName, Setting } from "../Types";

export default function SettingsDisplay() {
  const playerStore = useSelector((state: RootState) => state.player);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  function settingModifiedHandler(setting: string, value: string) {
    dispatch(modifySettingValue({ setting: setting as Setting, value: value }));
  }

  return (
    <section id="sim-settings">
      <fieldset>
        <legend>Rotation Options</legend>
        <input
          id='sim-chooses-option'
          onChange={(e) => settingModifiedHandler(Setting.rotationOption, e.target.value)}
          type='radio'
          name='rotationOption'
          value='simChooses'
          checked={playerStore.settings.rotationOption === 'simChooses'}
        />
        <label htmlFor='sim-chooses-option'>Simulation chooses spells for me</label>
        <br />
        <input
          id='user-chooses-option'
          onChange={(e) => settingModifiedHandler(Setting.rotationOption, e.target.value)}
          type='radio'
          name='rotationOption'
          value='userChooses'
          checked={playerStore.settings.rotationOption === 'userChooses'}
        />
        <label htmlFor='user-chooses-option'>Choose spells myself</label>
      </fieldset>
      <ul>
        <li>
          <label className="settings-left">Race</label>
          <select
            onChange={(e) => {
              settingModifiedHandler(Setting.race, e.target.value);
              dispatch(setBaseStats(getBaseStats(Races.find(race => race.varName === e.target.value)!.varName)));
            }}
            name="race"
            id="race-dropdown-list"
            className="settings-right"
            value={playerStore.settings.race}
          >
            <option value="gnome">{t('Gnome')}</option>
            <option value="human">{t('Human')}</option>
            <option value="orc">{t('Orc')}</option>
            <option value="undead">{t('Undead')}</option>
            <option value="bloodElf">{t('Blood Elf')}</option>
          </select>
        </li>
        <li>
          <label htmlFor='iterations' className="settings-left">
            Iterations
          </label>
          <input
            id="iterations"
            onChange={(e) => settingModifiedHandler(Setting.iterations, e.target.value)}
            value={playerStore.settings.iterations}
            step='1000'
            min="1000"
            type="number"
            name="iterations"
            className="settings-right"
          />
        </li>
        <li>
          <label htmlFor='min-fight-length' className="settings-left">
            Min Fight Length
          </label>
          <input
            id="min-fight-length"
            onChange={(e) => settingModifiedHandler(Setting['min-fight-length'], e.target.value)}
            value={playerStore.settings['min-fight-length']}
            type="number"
            name="min-fight-length"
            className="settings-right"
          />
        </li>
        <li>
          <label htmlFor='max-fight-length' className="settings-left">
            Max Fight Length
          </label>
          <input
            id="max-fight-length"
            onChange={(e) => settingModifiedHandler(Setting['max-fight-length'], e.target.value)}
            value={playerStore.settings['max-fight-length']}
            type="number"
            name="max-fight-length"
            className="settings-right"
          />
        </li>
        <li>
          <label htmlFor='target-level' className="settings-left">
            Target Level
          </label>
          <input
            id="target-level"
            onChange={(e) => settingModifiedHandler(Setting['target-level'], e.target.value)}
            value={playerStore.settings['target-level']}
            type="number"
            name="target-level"
            className="settings-right"
          />
        </li>
        <li>
          <label htmlFor='target-shadow-resistance' className="settings-left">
            Target Shadow Resistance
          </label>
          <input
            id="target-shadow-resistance"
            onChange={(e) => settingModifiedHandler(Setting['target-shadow-resistance'], e.target.value)}
            value={playerStore.settings['target-shadow-resistance']}
            type="number"
            name="target-shadow-resistance"
            className="settings-right"
          />
        </li>
        <li>
          <label htmlFor='target-fire-resistance' className="settings-left">
            Target Fire Resistance
          </label>
          <input
            id="target-fire-resistance"
            onChange={(e) => settingModifiedHandler(Setting['target-fire-resistance'], e.target.value)}
            value={playerStore.settings['target-fire-resistance']}
            type="number"
            name="target-fire-resistance"
            className="settings-right"
          />
        </li>
        <li>
          <label className="settings-left">
            Fight Type
          </label>
          <select
            onChange={(e) => settingModifiedHandler(Setting.fightType, e.target.value)}
            value={playerStore.settings.fightType}
            name="fightType" id="fight-type"
            className="settings-right"
          >
            <option value="singleTarget">Single Target</option>
            <option value="aoe">AoE (Seed of Corruption)</option>
          </select>
        </li>
        {
          playerStore.settings.fightType === 'aoe' &&
          <li id="enemy-amount" title="Including the target you're casting Seed of Corruption on">
            <label className="settings-left">
              Enemy Amount
            </label>
            <input
              name="enemyAmount"
              className="settings-right"
              onChange={(e) => settingModifiedHandler(Setting.enemyAmount, e.target.value)}
              value={playerStore.settings.enemyAmount}
              step="1"
              min="1"
              type="number"
            />
          </li>
        }
        <li id='automatically-open-sim-details'>
          <label className="settings-left" htmlFor="automatically-open-sim-details">
            Show Damage & Aura Tables
          </label>
          <select
            className="settings-right"
            name="automatically-open-sim-details"
            onChange={(e) => settingModifiedHandler(Setting['automatically-open-sim-details'], e.target.value)}
            value={playerStore.settings['automatically-open-sim-details']}
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </li>
        <li
          id='randomizeValues'
          title="Chooses a random value between a minimum and a maximum value instead of taking the average of the two.">
          <label className="settings-left" htmlFor="randomizeValues">
            Randomize instead of averaging
          </label>
          <select
            className="settings-right"
            name="randomizeValues"
            onChange={(e) => settingModifiedHandler(Setting.randomizeValues, e.target.value)}
            value={playerStore.settings.randomizeValues}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </li>
        <li id="infinitePlayerMana">
          <label className="settings-left" htmlFor="infinitePlayerMana">
            Infinite player mana?
          </label>
          <select
            className="settings-right"
            name="infinitePlayerMana"
            onChange={(e) => settingModifiedHandler(Setting.infinitePlayerMana, e.target.value)}
            value={playerStore.settings.infinitePlayerMana}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </li>
        <li id="infinitePetMana">
          <label className="settings-left" htmlFor="infinitePetMana">
            Infinite pet mana?
          </label>
          <select
            className="settings-right"
            name="infinitePetMana"
            onChange={(e) => settingModifiedHandler(Setting.infinitePetMana, e.target.value)}
            value={playerStore.settings.infinitePetMana}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </li>
        <li id='petChoice'>
          <label className="settings-left" htmlFor="petChoice">
            Pet
          </label>
          <select
            className="settings-right"
            name="petChoice"
            onChange={(e) => settingModifiedHandler(Setting.petChoice, e.target.value)}
            value={playerStore.settings.petChoice}
          >
            <option value={PetName.IMP}>{t('Imp')}</option>
            <option value={PetName.SUCCUBUS}>{t('Succubus')}</option>
            <option value={PetName.FELGUARD}>{t('Felguard')}</option>
          </select>
        </li>
        {
          playerStore.talents.demonicSacrifice === 1 &&
          <li id="sacrificePet">
            <label className="settings-left" htmlFor="sacrificePet">
              Sacrifice pet?
            </label>
            <select
              className="settings-right"
              name="sacrificePet"
              onChange={(e) => settingModifiedHandler(Setting.sacrificePet, e.target.value)}
              value={playerStore.settings.sacrificePet}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </li>
        }
        {
          isPetActive(playerStore.talents, playerStore.settings, false, false) &&
          <li id="petMode">
            <label className="settings-left" htmlFor="petMode">
              Pet mode
            </label>
            <select
              className="settings-right"
              name="petMode"
              onChange={(e) => settingModifiedHandler(Setting.petMode, e.target.value)}
              value={playerStore.settings.petMode}
            >
              <option value="0">Passive</option>
              <option value="1">Aggressive</option>
            </select>
          </li>
        }
        {
          isPetActive(playerStore.talents, playerStore.settings, true, false) &&
          <li id="prepopBlackBook">
            <label className="settings-left" htmlFor="prepopBlackBook">
              Prepop Black Book?
            </label>
            <select
              className="settings-right"
              name="prepopBlackBook"
              onChange={(e) => settingModifiedHandler(Setting.prepopBlackBook, e.target.value)}
              value={playerStore.settings.prepopBlackBook}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </li>
        }
        {
          // Shattered Sun Pendant of Acumen equipped
          playerStore.selectedItems.neck === 34678 &&
          <>
            <li id="shattrathFaction">
              <label className="settings-left" htmlFor="shattrathFaction">
                Shattrath Faction
              </label>
              <select
                className="settings-right"
                name="shattrathFaction"
                onChange={(e) => settingModifiedHandler(Setting.shattrathFaction, e.target.value)}
                value={playerStore.settings.shattrathFaction}
              >
                <option value="Aldor">Aldor</option>
                <option value="Scryers">Scryers</option>
              </select>
            </li>
            <li id="shattrathFactionReputation">
              <label className="settings-left" htmlFor="shattrathFactionReputation">
                Exalted with Shattrath Faction
              </label>
              <select
                className="settings-right"
                name="shattrathFactionReputation"
                onChange={(e) => settingModifiedHandler(Setting.shattrathFactionReputation, e.target.value)}
                value={playerStore.settings.shattrathFactionReputation}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </li>
          </>
        }
        {
          // Display if pet is succubus, pet is aggressive, and pet is not being sacrificed.
          isPetActive(playerStore.talents, playerStore.settings, true, true) && playerStore.settings.petChoice === PetName.SUCCUBUS &&
          <li id="lashOfPainUsage">
            <label className='settings-left' htmlFor='lashOfPainUsage'>
              When to use Lash of Pain?
            </label>
            <select
              className='settings-right'
              name='lashOfPainUsage'
              onChange={(e) => settingModifiedHandler(Setting.lashOfPainUsage, e.target.value)}
              value={playerStore.settings.lashOfPainUsage}
            >
              <option value='noISB'>When ISB is not up</option>
              <option value='onCooldown'>On Cooldown</option>
            </select>
          </li>
        }
        {
          isPetActive(playerStore.talents, playerStore.settings, true, true) &&
          <li id="enemyArmor">
            <label className="settings-left" htmlFor="enemyArmor">
              Enemy Armor
            </label>
            <input
              className="settings-right"
              onChange={(e) => settingModifiedHandler(Setting.enemyArmor, e.target.value)}
              value={playerStore.settings.enemyArmor}
              type="number"
              min='0' max='10000'
              name="enemyArmor"
            />
          </li>
        }
        {
          playerStore.auras.curseOfTheElements === true &&
          <li id="improvedCurseOfTheElements">
            <label className="settings-left">
              Malediction?
            </label>
            <select
              className="settings-right"
              name="improvedCurseOfTheElements"
              onChange={(e) => settingModifiedHandler(Setting.improvedCurseOfTheElements, e.target.value)}
              value={playerStore.settings.improvedCurseOfTheElements}
            >
              <option value='0'>No</option>
              <option value='1'>1/3</option>
              <option value='2'>2/3</option>
              <option value='3'>3/3</option>
            </select>
          </li>
        }
        {
          playerStore.auras.powerInfusion &&
          <li id="powerInfusionAmount">
            <label className="settings-left" htmlFor="powerInfusionAmount">
              Power Infusion amount
            </label>
            <select
              className="settings-right"
              name="powerInfusionAmount"
              onChange={(e) => settingModifiedHandler(Setting.powerInfusionAmount, e.target.value)}
              value={playerStore.settings.powerInfusionAmount}
            >
              {
                Array
                  .from(Array(12), (e, i) => i + 1)
                  .map(number =>
                    <option value={number} key={number}>{number}</option>
                  )
              }
            </select>
          </li>
        }
        {
          playerStore.auras.bloodlust &&
          <li id="bloodlustAmount">
            <label className="settings-left" htmlFor="bloodlustAmount">
              Bloodlust amount
            </label>
            <select
              className="settings-right"
              name="bloodlustAmount"
              onChange={(e) => settingModifiedHandler(Setting.bloodlustAmount, e.target.value)}
              value={playerStore.settings.bloodlustAmount}
            >
              {
                Array.from(Array(15), (e, i) => i + 1).map(number =>
                  <option
                    value={number} key={number}>{number}</option>
                )
              }
            </select>
          </li>
        }
        {
          playerStore.auras.innervate &&
          <li id="innervateAmount">
            <label className="settings-left" htmlFor="innervateAmount">
              Innervate amount
            </label>
            <select
              className="settings-right"
              name="innervateAmount"
              onChange={(e) => settingModifiedHandler(Setting.innervateAmount, e.target.value)}
              value={playerStore.settings.innervateAmount}
            >
              {
                Array.from(Array(18), (e, i) => i + 1).map(number =>
                  <option
                    value={number} key={number}>{number}</option>
                )
              }
            </select>
          </li>
        }
        {
          playerStore.auras.prayerOfSpirit &&
          <li id="improvedDivineSpirit">
            <label className="settings-left" htmlFor="improvedDivineSpirit">
              Improved Divine Spirit?
            </label>
            <select
              className="settings-right"
              name="improvedDivineSpirit"
              onChange={(e) => settingModifiedHandler(Setting.improvedDivineSpirit, e.target.value)}
              value={playerStore.settings.improvedDivineSpirit}
            >
              <option value="0">No</option>
              <option value="1">1/2</option>
              <option value="2">2/2</option>
            </select>
          </li>
        }
        {
          playerStore.auras.powerOfTheGuardianMage &&
          <li id="mageAtieshAmount">
            <label className="settings-left" htmlFor="mageAtieshAmount">
              Mage Atiesh amount
            </label>
            <select
              className="settings-right"
              name="mageAtieshAmount"
              onChange={(e) => settingModifiedHandler(Setting.mageAtieshAmount, e.target.value)}
              value={playerStore.settings.mageAtieshAmount}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </li>
        }
        {
          playerStore.auras.powerOfTheGuardianWarlock &&
          <li id="warlockAtieshAmount">
            <label className="settings-left" htmlFor="warlockAtieshAmount">
              Warlock Atiesh amount
            </label>
            <select
              className="settings-right"
              name="warlockAtieshAmount"
              onChange={(e) => settingModifiedHandler(Setting.warlockAtieshAmount, e.target.value)}
              value={playerStore.settings.warlockAtieshAmount}
            >
              <option disabled={true} value="0">{'>> Do not count your own Atiesh <<'}</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </li>
        }
        {
          playerStore.auras.totemOfWrath &&
          <li id="totemOfWrathAmount">
            <label className="settings-left" htmlFor="totemOfWrathAmount">
              Totem of Wrath amount
            </label>
            <select
              className="settings-right"
              name="totemOfWrathAmount"
              onChange={(e) => settingModifiedHandler(Setting.totemOfWrathAmount, e.target.value)}
              value={playerStore.settings.totemOfWrathAmount}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </li>
        }
        {
          playerStore.auras.ferociousInspiration &&
          <li id="ferociousInspirationAmount">
            <label className="settings-left" htmlFor="ferociousInspirationAmount">
              Ferocious Inspiration amount
            </label>
            <select
              className="settings-right"
              name="ferociousInspirationAmount"
              onChange={(e) => settingModifiedHandler(Setting.ferociousInspirationAmount, e.target.value)}
              value={playerStore.settings.ferociousInspirationAmount}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </li>
        }
        {
          playerStore.auras.wrathOfAirTotem &&
          <li id="improvedWrathOfAirTotem">
            <label className="settings-left" htmlFor="improvedWrathOfAirTotem">
              Elemental Shaman T4 2pc bonus?
            </label>
            <select
              className="settings-right"
              name="improvedWrathOfAirTotem"
              onChange={(e) => settingModifiedHandler(Setting.improvedWrathOfAirTotem, e.target.value)}
              value={playerStore.settings.improvedWrathOfAirTotem}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </li>
        }
        {
          playerStore.auras.vampiricTouch &&
          <li id='shadowPriestDps'>
            <label className="settings-left" htmlFor="shadowPriestDps">
              Shadow Priest Dps
            </label>
            <input
              className='settings-right'
              onChange={(e) => settingModifiedHandler(Setting.shadowPriestDps, e.target.value)}
              value={playerStore.settings.shadowPriestDps}
              type="number"
              min='0'
              name="shadowPriestDps"
            />
          </li>
        }
        {
          playerStore.auras.bloodPact &&
          <li id='improvedImpSetting'>
            <label className='settings-left' htmlFor="improvedImpSetting">
              Improved Imp?
            </label>
            <select
              className='settings-right'
              name='improvedImpSetting'
              onChange={(e) => settingModifiedHandler(Setting.improvedImpSetting, e.target.value)}
              value={playerStore.settings.improvedImpSetting}
            >
              <option value='0'>No</option>
              <option value='1'>1/3</option>
              <option value='2'>2/3</option>
              <option value='3'>3/3</option>
            </select>
          </li>
        }
        {
          playerStore.auras.faerieFire &&
          isPetActive(playerStore.talents, playerStore.settings, true, true) &&
          <li id='improvedFaerieFire'>
            <label className='settings-left' htmlFor="improvedFaerieFire">
              Improved Faerie Fire?
            </label>
            <select
              className='settings-right'
              name='improvedFaerieFire'
              onChange={(e) => settingModifiedHandler(Setting.improvedFaerieFire, e.target.value)}
              value={playerStore.settings.improvedFaerieFire}
            >
              <option value='no'>No</option>
              <option value='yes'>Yes</option>
            </select>
          </li>
        }
        {
          playerStore.auras.exposeArmor && isPetActive(playerStore.talents, playerStore.settings, true, true) &&
          <li id='improvedExposeArmor'>
            <label className='settings-left' htmlFor="improvedExposeArmor">
              Improved Expose Armor?
            </label>
            <select
              className='settings-right'
              name='improvedExposeArmor'
              onChange={(e) => settingModifiedHandler(Setting.improvedExposeArmor, e.target.value)}
              value={playerStore.settings.improvedExposeArmor}
            >
              <option value='0'>No</option>
              <option value='1'>1/2</option>
              <option value='2'>2/2</option>
            </select>
          </li>
        }
        {
          playerStore.auras.exposeWeakness &&
          isPetActive(playerStore.talents, playerStore.settings, true, true) &&
          <div>
            <li id='survivalHunterAgility'>
              <label className="settings-left" htmlFor="survivalHunterAgility">
                Survival Hunter Agility
              </label>
              <input
                className='settings-right'
                onChange={(e) => settingModifiedHandler(Setting.survivalHunterAgility, e.target.value)}
                value={playerStore.settings.survivalHunterAgility}
                type="number"
                min='0'
                name="survivalHunterAgility"
              />
            </li>
            <li id='exposeWeaknessUptime'>
              <label className="settings-left" htmlFor="exposeWeaknessUptime">
                Expose Weakness Uptime %
              </label>
              <input
                className='settings-right'
                onChange={(e) => settingModifiedHandler(Setting.exposeWeaknessUptime, e.target.value)}
                value={playerStore.settings.exposeWeaknessUptime}
                type="number"
                min='0'
                name="exposeWeaknessUptime"
              />
            </li>
          </div>
        }
        <li id="customIsbUptime">
          <label className="settings-left" htmlFor="customIsbUptime">
            Use custom ISB uptime %?
          </label>
          <select
            className="settings-right"
            name="customIsbUptime"
            onChange={(e) => settingModifiedHandler(Setting.customIsbUptime, e.target.value)}
            value={playerStore.settings.customIsbUptime}
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </li>
        {
          playerStore.settings.customIsbUptime === 'yes' &&
          <li id="custom-isb-uptime-value">
            <label htmlFor='customIsbUptimeValue' className="settings-left">
              Custom ISB Uptime %
            </label>
            <input
              id="customIsbUptimeValue"
              onChange={(e) => settingModifiedHandler(Setting.customIsbUptimeValue, e.target.value)}
              value={playerStore.settings.customIsbUptimeValue}
              type="number"
              name="customIsbUptimeValue"
              className="settings-right"
            />
          </li>
        }
        <li>
          <label className='settings-left'>
            Concurrent item sims amount (set to 0 to use the default amount)
          </label>
          <input
            className='settings-right'
            onChange={(e) => settingModifiedHandler(Setting.maxWebWorkers, e.target.value)}
            value={playerStore.settings.maxWebWorkers || 0}
            type='number'
          />
        </li>
      </ul>
    </section>
  )
}