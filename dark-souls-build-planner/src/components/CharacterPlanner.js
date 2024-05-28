import React, { useState, useEffect } from 'react';
import './CharacterPlanner.css';
import { calculateWeaponDamage } from './StatCalculator';

const CharacterPlanner = () => {
    const [characterData, setCharacterData] = useState([]);
    const [weaponData, setWeaponData] = useState([]);
    const [armorData, setArmorData] = useState([]);
    const [ringData, setRingData] = useState([]);
    const [selectedClass, setSelectedClass] = useState('Knight');
    const [selectedWeapons, setSelectedWeapons] = useState([]);
    const [selectedArmor, setSelectedArmor] = useState([]);
    const [selectedRings, setSelectedRings] = useState([]);
    const [character, setCharacter] = useState(null);

    // Fetch classes data
    useEffect(() => {
        fetch('/api/classes')
            .then(response => response.json())
            .then(data => {
                setCharacterData(data);
                setCharacter(data.find(c => c.class === selectedClass));
            })
            .catch(error => console.error('Error fetching character data:', error));
    }, [selectedClass]);

    // Fetch weapons data
    useEffect(() => {
        fetch('/api/weapons')
            .then(response => response.json())
            .then(data => setWeaponData(data))
            .catch(error => console.error('Error fetching weapon data:', error));
    }, []);

    // Fetch armor data
    useEffect(() => {
        fetch('/api/armor')
            .then(response => response.json())
            .then(data => setArmorData(data))
            .catch(error => console.error('Error fetching armor data:', error));
    }, []);

    // Fetch rings data
    useEffect(() => {
        fetch('/api/rings')
            .then(response => response.json())
            .then(data => setRingData(data))
            .catch(error => console.error('Error fetching ring data:', error));
    }, []);

    const handleInputChange = (section, key, value) => {
        if (value >= 0) {
            setCharacter(prevState => ({
                ...prevState,
                [section]: {
                    ...prevState[section],
                    [key]: value
                }
            }));
        }
    };

    const handleWeaponSelect = (e) => {
        const weaponName = e.target.value;
        if (weaponName && !selectedWeapons.find(w => w.name === weaponName)) {
            const weapon = weaponData.find(w => w.name === weaponName);
            setSelectedWeapons([...selectedWeapons, { ...weapon, upgradeLevel: 0, infusion: 'None' }]);
        }
    };

    const handleWeaponRemove = (weaponName) => {
        setSelectedWeapons(selectedWeapons.filter(w => w.name !== weaponName));
    };

    const handleWeaponUpgrade = (weaponName, upgradeLevel) => {
        if (upgradeLevel >= 0) {
            const weaponIndex = selectedWeapons.findIndex(w => w.name === weaponName);
            if (weaponIndex >= 0) {
                const weapon = selectedWeapons[weaponIndex];
                weapon.upgradeLevel = upgradeLevel;
                const updatedWeapons = [...selectedWeapons];
                updatedWeapons[weaponIndex] = weapon;
                setSelectedWeapons(updatedWeapons);
            }
        }
    };

    const handleInfusionChange = (weaponName, infusion) => {
        const weaponIndex = selectedWeapons.findIndex(w => w.name === weaponName);
        if (weaponIndex >= 0) {
            const weapon = selectedWeapons[weaponIndex];
            weapon.infusion = infusion;
            const updatedWeapons = [...selectedWeapons];
            updatedWeapons[weaponIndex] = weapon;
            setSelectedWeapons(updatedWeapons);
        }
    };

    const handleArmorSelect = (e) => {
        const armorName = e.target.value;
        if (armorName && !selectedArmor.find(a => a.name === armorName)) {
            const armor = armorData.find(a => a.name === armorName);
            setSelectedArmor([...selectedArmor, armor]);
        }
    };

    const handleArmorRemove = (armorName) => {
        setSelectedArmor(selectedArmor.filter(a => a.name !== armorName));
    };

    const handleRingSelect = (e) => {
        const ringName = e.target.value;
        if (ringName && !selectedRings.find(r => r.name === ringName)) {
            const ring = ringData.find(r => r.name === ringName);
            setSelectedRings([...selectedRings, ring]);
        }
    };

    const handleRingRemove = (ringName) => {
        setSelectedRings(selectedRings.filter(r => r.name !== ringName));
    };

    const calculateStats = () => {
        if (!character) return {};

        let totalHealth = character.attributes.vigor * 10;
        let totalStamina = character.attributes.endurance * 5;
        let totalDefense = character.attributes.vitality * 2;
        let totalEquipLoad = character.attributes.vitality * 1.5;
        let totalPoise = 0;
        let totalAttunementSlots = Math.floor(character.attributes.attunement / 10);
        let totalBleedResistance = character.attributes.endurance * 2;
        let totalPoisonResistance = character.attributes.endurance * 2;
        let totalCurseResistance = character.attributes.faith * 2;
        let totalItemDiscovery = character.attributes.luck * 1.5;

        selectedArmor.forEach(armor => {
            totalDefense += (armor.def.physical || 0) + (armor.def.magic || 0) + (armor.def.fire || 0) + (armor.def.lightning || 0);
            totalPoise += armor.poise || 0;
            totalBleedResistance += armor.resist?.bleed || 0;
            totalPoisonResistance += armor.resist?.poison || 0;
            totalCurseResistance += armor.resist?.curse || 0;
            totalEquipLoad += armor.weight || 0;
        });

        selectedRings.forEach(ring => {
            if (ring.effects.health) totalHealth *= ring.effects.health;
            if (ring.effects.stamina) totalStamina *= ring.effects.stamina;
            if (ring.effects.equipLoad) totalEquipLoad *= ring.effects.equipLoad;
            if (ring.effects.poise) totalPoise += ring.effects.poise;
            if (ring.effects.bleedResist) totalBleedResistance += ring.effects.bleedResist;
            if (ring.effects.poisonResist) totalPoisonResistance += ring.effects.poisonResist;
            if (ring.effects.curseResist) totalCurseResistance += ring.effects.curseResist;
            if (ring.effects.itemDiscovery) totalItemDiscovery *= ring.effects.itemDiscovery;
        });

        return {
            health: Math.round(totalHealth),
            stamina: Math.round(totalStamina),
            defense: Math.round(totalDefense),
            equipLoad: Math.round(totalEquipLoad),
            poise: Math.round(totalPoise),
            attunementSlots: totalAttunementSlots,
            bleedResist: Math.round(totalBleedResistance),
            poisonResist: Math.round(totalPoisonResistance),
            curseResist: Math.round(totalCurseResistance),
            itemDiscovery: Math.round(totalItemDiscovery),
        };
    };

    const calculateTotalDamage = () => {
        if (!character) return {
            totalPhysical: 0,
            totalMagic: 0,
            totalFire: 0,
            totalLightning: 0,
        };

        let totalPhysical = 0;
        let totalMagic = 0;
        let totalFire = 0;
        let totalLightning = 0;

        selectedWeapons.forEach(weapon => {
            const weaponDamage = calculateWeaponDamage(weapon, character.attributes);
            totalPhysical += weaponDamage.physical.flat + weaponDamage.physical.bonus;
            totalMagic += weaponDamage.magic.flat + weaponDamage.magic.bonus;
            totalFire += weaponDamage.fire.flat + weaponDamage.fire.bonus;
            totalLightning += weaponDamage.lightning.flat + weaponDamage.lightning.bonus;
        });

        return {
            totalPhysical,
            totalMagic,
            totalFire,
            totalLightning
        };
    };

    const calculateMovementSpeed = () => {
        if (!character) return "N/A";

        const totalWeight = selectedWeapons.reduce((sum, weapon) => sum + weapon.weight, 0) +
                            selectedArmor.reduce((sum, armor) => sum + armor.weight, 0) +
                            (character.attributes.vitality * 1.5); // базовий вантажопідйомність
        const equipLoad = character.attributes.vitality * 1.5;

        let speedPercentage = (totalWeight / equipLoad) * 100;

        if (speedPercentage < 25) {
            return "Fast";
        } else if (speedPercentage < 50) {
            return "Medium";
        } else if (speedPercentage < 75) {
            return "Slow";
        } else {
            return "Very Slow";
        }
    };

    const stats = calculateStats();
    const totalDamage = calculateTotalDamage();
    const movementSpeed = calculateMovementSpeed();

    return (
        <div className="character-planner">
            <div className="header"></div>
            <div className="class-section">
                <label>Class</label>
                <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                    {characterData.map(c => (
                        <option key={c.class} value={c.class}>{c.class}</option>
                    ))}
                </select>
            </div>
            <div className="panel-container">
                <div className="panel">
                    <div className="attributes-section">
                        <h3>Attributes</h3>
                        {character && Object.keys(character.attributes).map(attr => (
                            <div className="attribute" key={attr}>
                                <label>{attr.charAt(0).toUpperCase() + attr.slice(1)}</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={character.attributes[attr]}
                                    onChange={(e) => handleInputChange('attributes', attr, parseInt(e.target.value))}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="stats-section">
                        <h3>Statistics</h3>
                        <div className="stat">
                            <label>Health</label>
                            <span>{stats.health}</span>
                        </div>
                        <div className="stat">
                            <label>Stamina</label>
                            <span>{stats.stamina}</span>
                        </div>
                        <div className="stat">
                            <label>Defense</label>
                            <span>{stats.defense}</span>
                        </div>
                        <div className="stat">
                            <label>Equip Load</label>
                            <span>{stats.equipLoad}</span>
                        </div>
                        <div className="stat">
                            <label>Poise</label>
                            <span>{stats.poise}</span>
                        </div>
                        <div className="stat">
                            <label>Attunement Slots</label>
                            <span>{stats.attunementSlots}</span>
                        </div>
                        <div className="stat">
                            <label>Bleed Resistance</label>
                            <span>{stats.bleedResist}</span>
                        </div>
                        <div className="stat">
                            <label>Poison Resistance</label>
                            <span>{stats.poisonResist}</span>
                        </div>
                        <div className="stat">
                            <label>Curse Resistance</label>
                            <span>{stats.curseResist}</span>
                        </div>
                        <div className="stat">
                            <label>Item Discovery</label>
                            <span>{stats.itemDiscovery}</span>
                        </div>
                    </div>
                </div>
                <div className="panel">
                    <div className="armor-section">
                        <h3>Armor</h3>
                        <select onChange={handleArmorSelect}>
                            <option value="">Select Armor</option>
                            {armorData.map(a => (
                                <option key={a.name} value={a.name}>{a.name}</option>
                            ))}
                        </select>
                        <div className="selected-armor">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Type</th>
                                        <th>Physical Defense</th>
                                        <th>Magic Defense</th>
                                        <th>Fire Defense</th>
                                        <th>Lightning Defense</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedArmor.map(armor => (
                                        <tr key={armor.name}>
                                            <td>{armor.name}</td>
                                            <td>{armor.type}</td>
                                            <td>{armor.def.physical}</td>
                                            <td>{armor.def.magic}</td>
                                            <td>{armor.def.fire}</td>
                                            <td>{armor.def.lightning}</td>
                                            <td>
                                                <button onClick={() => handleArmorRemove(armor.name)}>Remove</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="ring-section">
                        <h3>Rings</h3>
                        <select onChange={handleRingSelect}>
                            <option value="">Select Ring</option>
                            {ringData.map(r => (
                                <option key={r.name} value={r.name}>{r.name}</option>
                            ))}
                        </select>
                        <div className="selected-rings">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Effects</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedRings.map(ring => (
                                        <tr key={ring.name}>
                                            <td>{ring.name}</td>
                                            <td>{Object.entries(ring.effects).map(([effect, value]) => (
                                                <div key={effect}>{effect}: {value}</div>
                                            ))}</td>
                                            <td>
                                                <button onClick={() => handleRingRemove(ring.name)}>Remove</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="panel">
                    <div className="weapons-section">
                        <h3>Weapons</h3>
                        <select onChange={handleWeaponSelect}>
                            <option value="">Select Weapon</option>
                            {weaponData.map(w => (
                                <option key={w.name} value={w.name}>{w.name}</option>
                            ))}
                        </select>
                        <div className="selected-weapons">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Physical</th>
                                        <th>Magic</th>
                                        <th>Fire</th>
                                        <th>Lightning</th>
                                        <th>Upgrade Level</th>
                                        <th>Infusion</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedWeapons.map(weapon => {
                                        const weaponDamage = calculateWeaponDamage(weapon, character?.attributes || {});
                                        return (
                                            <tr key={weapon.name}>
                                                <td>{weapon.name}</td>
                                                <td>{weaponDamage.physical.flat} + {weaponDamage.physical.bonus}</td>
                                                <td>{weaponDamage.magic.flat} + {weaponDamage.magic.bonus || '-'}</td>
                                                <td>{weaponDamage.fire.flat} + {weaponDamage.fire.bonus || '-'}</td>
                                                <td>{weaponDamage.lightning.flat} + {weaponDamage.lightning.bonus || '-'}</td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="1"
                                                        value={weapon.upgradeLevel}
                                                        onChange={(e) => handleWeaponUpgrade(weapon.name, parseInt(e.target.value))}
                                                    />
                                                </td>
                                                <td>
                                                    <select
                                                        value={weapon.infusion}
                                                        onChange={(e) => handleInfusionChange(weapon.name, e.target.value)}
                                                    >
                                                        <option value="None">None</option>
                                                        <option value="Refined">Refined</option>
                                                        <option value="Raw">Raw</option>
                                                        <option value="Fire">Fire</option>
                                                        <option value="Lightning">Lightning</option>
                                                        <option value="Magic">Magic</option>
                                                        <option value="Divine">Divine</option>
                                                        <option value="Chaos">Chaos</option>
                                                        <option value="Dark">Dark</option>
                                                        <option value="Blessed">Blessed</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <button onClick={() => handleWeaponRemove(weapon.name)}>Remove</button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="total-damage-section">
                        <h3>Total Damage</h3>
                        <div className="damage">
                            <label>Physical:</label>
                            <span>{totalDamage.totalPhysical}</span>
                        </div>
                        <div className="damage">
                            <label>Magic:</label>
                            <span>{totalDamage.totalMagic}</span>
                        </div>
                        <div className="damage">
                            <label>Fire:</label>
                            <span>{totalDamage.totalFire}</span>
                        </div>
                        <div className="damage">
                            <label>Lightning:</label>
                            <span>{totalDamage.totalLightning}</span>
                        </div>
                    </div>
                    <div className="movement-speed-section">
                        <h3>Movement Speed</h3>
                        <div className="speed">
                            <label>Speed:</label>
                            <span>{movementSpeed}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CharacterPlanner;
