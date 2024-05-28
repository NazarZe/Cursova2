export const calculateWeaponDamage = (weapon, attributes) => {
    const scalingFactors = {
        S: 2.0,
        A: 1.75,
        B: 1.5,
        C: 1.25,
        D: 1.0,
        E: 0.5,
        '-': 0
    };

    const calculateBonus = (base, scaling, attribute, upgradeLevel) => {
        const baseScaling = scalingFactors[scaling] || 0;
        const upgradeScaling = 1 + (upgradeLevel * 0.05); // Increase scaling factor with each upgrade level
        return base * baseScaling * (attribute / 100) * upgradeScaling;
    };

    const getBaseDamageMultiplier = (upgradeLevel) => {
        if (upgradeLevel <= 5) {
            return 1 + upgradeLevel * 0.1;
        } else if (upgradeLevel <= 10) {
            return 1.5 + (upgradeLevel - 5) * 0.2;
        } else {
            return 2.5 + (upgradeLevel - 10) * 0.3;
        }
    };

    const applyInfusionEffects = (weapon, infusion) => {
        switch (infusion) {
            case 'Refined':
                weapon.scale.strength = weapon.scale.strength !== '-' ? 'B' : '-';
                weapon.scale.dexterity = weapon.scale.dexterity !== '-' ? 'B' : '-';
                weapon.atk.physical *= 0.8; // Reduces base damage
                break;
            case 'Raw':
                weapon.atk.physical *= 1.3; // Increases base damage
                weapon.scale = { strength: '-', dexterity: '-', intelligence: '-', faith: '-' };
                break;
            case 'Fire':
                weapon.atk.fire = weapon.atk.physical * 0.7;
                weapon.atk.physical *= 0.7;
                weapon.scale = { strength: '-', dexterity: '-', intelligence: '-', faith: '-' };
                break;
            case 'Lightning':
                weapon.atk.lightning = weapon.atk.physical * 0.7;
                weapon.atk.physical *= 0.7;
                weapon.scale = { strength: 'E', dexterity: 'E', intelligence: '-', faith: '-' };
                break;
            case 'Magic':
                weapon.atk.magic = weapon.atk.physical * 0.7;
                weapon.atk.physical *= 0.7;
                weapon.scale.intelligence = 'B';
                weapon.scale.strength = 'E';
                weapon.scale.dexterity = 'E';
                break;
            case 'Divine':
                weapon.atk.magic = weapon.atk.physical * 0.7;
                weapon.atk.physical *= 0.7;
                weapon.scale.faith = 'B';
                weapon.scale.strength = 'E';
                weapon.scale.dexterity = 'E';
                break;
            case 'Chaos':
                weapon.atk.fire = weapon.atk.physical * 0.7;
                weapon.atk.physical *= 0.7;
                weapon.scale = { strength: '-', dexterity: '-', intelligence: '-', faith: '-' };
                // Add scaling with Humanity
                break;
            case 'Dark':
                weapon.atk.magic = weapon.atk.physical * 0.7;
                weapon.atk.physical *= 0.7;
                weapon.scale.intelligence = 'C';
                weapon.scale.faith = 'C';
                break;
            case 'Blessed':
                weapon.atk.physical *= 0.7;
                weapon.scale.faith = 'B';
                weapon.scale.strength = 'E';
                weapon.scale.dexterity = 'E';
                // Add HP recovery effect
                break;
            default:
                break;
        }
    };

    const weaponCopy = JSON.parse(JSON.stringify(weapon));
    applyInfusionEffects(weaponCopy, weapon.infusion);

    const baseMultiplier = getBaseDamageMultiplier(weaponCopy.upgradeLevel);

    const strengthBonus = calculateBonus(weaponCopy.atk.physical, weaponCopy.scale.strength, attributes.strength, weaponCopy.upgradeLevel);
    const dexterityBonus = calculateBonus(weaponCopy.atk.physical, weaponCopy.scale.dexterity, attributes.dexterity, weaponCopy.upgradeLevel);
    const intelligenceBonus = calculateBonus(weaponCopy.atk.magic, weaponCopy.scale.intelligence, attributes.intelligence, weaponCopy.upgradeLevel);
    const faithBonus = calculateBonus(weaponCopy.atk.magic, weaponCopy.scale.faith, attributes.faith, weaponCopy.upgradeLevel);

    const physicalFlat = weaponCopy.atk.physical * baseMultiplier;
    const physicalBonus = (strengthBonus + dexterityBonus) * baseMultiplier;

    const magicFlat = weaponCopy.atk.magic * baseMultiplier;
    const magicBonus = (intelligenceBonus + faithBonus) * baseMultiplier;

    const fireFlat = weaponCopy.atk.fire * baseMultiplier;
    const fireBonus = 0; // Fire damage typically does not scale with attributes

    const lightningFlat = weaponCopy.atk.lightning * baseMultiplier;
    const lightningBonus = 0; // Lightning damage typically does not scale with attributes

    return {
        physical: { flat: Math.round(physicalFlat), bonus: Math.round(physicalBonus) },
        magic: { flat: Math.round(magicFlat), bonus: Math.round(magicBonus) },
        fire: { flat: Math.round(fireFlat), bonus: Math.round(fireBonus) },
        lightning: { flat: Math.round(lightningFlat), bonus: Math.round(lightningBonus) }
    };
};
