
import { ConversionType } from '../types/unitTypes';

export const getDetailedExplanatoryNote = (
  type: ConversionType,
  fromUnit: string,
  toUnit: string
): string => {
  const conversionPair = `${fromUnit}_to_${toUnit}`;
  
  switch (type) {
    case "length":
      const lengthNotes: { [key: string]: string } = {
        meter_to_light_year: "⭐ Conversion astronomique approximative. 1 année-lumière = distance parcourue par la lumière en 1 an dans le vide (≈ 9,461 × 10¹⁵ m). Basée sur la vitesse de la lumière qui définit le mètre.",
        light_year_to_meter: "🌌 Une année-lumière représente environ 63 241 unités astronomiques. Le mètre est défini par la vitesse de la lumière dans le vide.",
        meter_to_astronomical_unit: "🪐 L'unité astronomique correspond à la distance moyenne Terre-Soleil (≈ 149,6 millions de km). Approximation basée sur des observations astronomiques.",
        inch_to_meter: "📏 Conversion système impérial → métrique. 1 pouce = exactement 2,54 cm selon la définition internationale de 1959.",
        foot_to_meter: "👣 Le pied international = 12 pouces = 30,48 cm exactement (défini en 1959). Standard international SI.",
        mile_to_kilometer: "🛣️ Mile terrestre US = 5280 pieds. Attention : différent du mile nautique (1852 m).",
        nautical_mile_to_meter: "⚓ Mile nautique = 1/60 de degré de latitude = 1852 m exactement (navigation maritime et aérienne)."
      };
      return lengthNotes[conversionPair] || "📐 Conversions basées sur le système international (SI). Le mètre est défini par la vitesse de la lumière. Les unités astronomiques utilisent des approximations.";

    case "weight":
      const weightNotes: { [key: string]: string } = {
        pound_to_kilogram: "⚖️ Livre internationale (avoirdupois) = 453,592338 g exactement. Standard SI basé sur la masse du kilogramme étalon.",
        ounce_to_gram: "🥄 Once avoirdupois = 1/16 livre = 28,3495 g. Attention : différent de l'once troy (31,1035 g) pour métaux précieux.",
        stone_to_kilogram: "🇬🇧 Stone britannique = 14 livres = 6,35029 kg. Encore utilisé au Royaume-Uni pour le poids corporel.",
        carat_to_gram: "💎 Carat métrique = 200 mg exactement. Utilisé exclusivement pour les pierres précieuses et perles.",
        ton_to_kilogram: "🚛 Tonne métrique = 1000 kg (SI). Attention : tonne US (907 kg) et tonne UK (1016 kg) sont différentes.",
        short_ton_to_kilogram: "🇺🇸 Tonne courte américaine = 2000 livres = 907,185 kg (système avoirdupois).",
        long_ton_to_kilogram: "🇬🇧 Tonne longue britannique = 2240 livres = 1016,047 kg (système impérial)."
      };
      return weightNotes[conversionPair] || "⚖️ Conversions basées sur le système international (SI). Le kilogramme est l'unité de masse de référence. Attention aux différences entre systèmes métrique, impérial et US.";

    case "temperature":
      const tempNotes: { [key: string]: string } = {
        celsius_to_fahrenheit: "🌡️ °F = (°C × 9/5) + 32. Points de référence : 0°C = 32°F (congélation), 100°C = 212°F (ébullition de l'eau). Conversion exacte selon définitions officielles.",
        fahrenheit_to_celsius: "🧊 °C = (°F - 32) × 5/9. Échelle Fahrenheit : 32°F (glace) à 212°F (vapeur d'eau) = 180 divisions.",
        celsius_to_kelvin: "❄️ K = °C + 273,15. Kelvin = unité SI absolue (0 K = zéro absolu = -273,15°C). Pas de valeurs négatives possibles.",
        kelvin_to_celsius: "🔬 Échelle thermodynamique SI. 0 K = arrêt complet du mouvement moléculaire. Kelvin est l'unité absolue de référence.",
        celsius_to_rankine: "🇺🇸 °R = (°C + 273,15) × 9/5. Rankine = Kelvin mais avec l'échelle Fahrenheit (échelle absolue US).",
        reaumur_to_celsius: "📚 Échelle Réaumur historique européenne : 0°Ré (glace) à 80°Ré (ébullition). °C = °Ré × 5/4. Utilisée avant Celsius."
      };
      return tempNotes[conversionPair] || "🌡️ Conversions exactes selon définitions officielles. Kelvin = unité SI absolue (pas de négatives). Rankine = Kelvin avec échelle Fahrenheit. Réaumur = échelle historique européenne.";

    case "volume":
      const volumeNotes: { [key: string]: string } = {
        liter_to_cubic_meter: "📏 1 L = 1 dm³ par définition SI (valide pour tous les fluides). Cette équivalence est universelle.",
        cubic_meter_to_liter: "🧪 1 m³ = 1000 L par définition. Volume ≠ capacité (le volume peut varier avec la température).",
        gallon_us_to_liter: "🇺🇸 Gallon liquide US = 3,785411784 L exactement. Différent du gallon impérial (4,546 L) - différence de 20%.",
        gallon_uk_to_liter: "🇬🇧 Gallon impérial = 4,54609 L exactement. Utilisé au Royaume-Uni, Canada, certains pays du Commonwealth.",
        cup_to_milliliter: "☕ Tasse US légale = 240 mL. Attention : tasse métrique = 250 mL, tasse UK = 284 mL. Les conversions culinaires peuvent varier.",
        tablespoon_to_milliliter: "🥄 Cuillère à soupe US = 14,7868 mL ≈ 15 mL. Variable selon pays : AU = 20 mL, UK = 17,7 mL.",
        teaspoon_to_milliliter: "🥄 Cuillère à café US = 4,929 mL ≈ 5 mL. Standard international culinaire ≈ 5 mL."
      };
      return volumeNotes[conversionPair] || "💧 1 litre = 1 dm³ par définition SI (valide tous fluides). Gallon US ≠ UK (différence 20%). Conversions culinaires peuvent varier selon ingrédients. Volume ≠ capacité (dépend température).";

    case "area":
      const areaNotes: { [key: string]: string } = {
        hectare_to_square_meter: "🌾 1 hectare = 10 000 m² = surface d'un carré de 100 m de côté. Unité agricole et forestière standard.",
        acre_to_square_meter: "🇺🇸 1 acre ≈ 4047 m² (surface historique anglo-saxonne). ATTENTION : Acre écossais = 5067 m², acre irlandais = 6555 m².",
        square_mile_to_square_kilometer: "🗺️ Mile carré = (1 mile)² = 2,59 km². Utilisé pour surfaces importantes (villes, pays).",
        square_foot_to_square_meter: "🏠 Pied carré = (12 pouces)² = 929,03 cm². Unité immobilière courante aux USA.",
        are_to_square_meter: "📐 1 are = 100 m² = surface d'un carré de 10 m de côté. 1 hectare = 100 ares. Attention : are ≠ acre."
      };
      return areaNotes[conversionPair] || "📐 1 hectare = 10 000 m² (carré 100m côté). 1 acre ≈ 4047 m² (surface historique anglo-saxonne). Surfaces courbes nécessitent calculs spécialisés. Attention : are (100 m²) ≠ acre.";

    case "energy":
      const energyNotes: { [key: string]: string } = {
        calorie_to_joule: "🔥 Calorie thermochimique = 4,184 J exactement. ATTENTION : Calorie nutritionnelle = 1 kcal = 4184 J.",
        kilocalorie_to_joule: "🍎 Kilocalorie = Calorie nutritionnelle = 1000 cal = 4184 J. C'est l'unité des étiquettes alimentaires.",
        kilowatt_hour_to_joule: "⚡ kWh = 3,6 MJ = unité de facturation électrique. Énergie ≠ puissance (Joule vs Watt).",
        btu_to_joule: "🇺🇸 BTU = énergie pour chauffer 1 livre d'eau de 1°F = 1055,06 J.",
        therm_to_joule: "🏠 Therm = 100 000 BTU ≈ 105,5 MJ. Unité de facturation du gaz naturel aux USA.",
        foot_pound_to_joule: "🔧 Pied-livre-force = travail d'une force de 1 lbf sur 1 pied = 1,356 J."
      };
      return energyNotes[conversionPair] || "⚡ Calorie nutritionnelle = kilocalorie (1000 cal). kWh = unité facturation électrique (3.6 MJ). BTU = énergie pour chauffer 1 livre d'eau de 1°F. Énergie ≠ puissance (Joule vs Watt).";

    case "speed":
      const speedNotes: { [key: string]: string } = {
        kilometer_per_hour_to_meter_per_second: "🚗 Conversion : km/h ÷ 3,6 = m/s. Ex: 36 km/h = 10 m/s, 72 km/h = 20 m/s.",
        mile_per_hour_to_kilometer_per_hour: "🇺🇸 Mile/h → km/h : multiplier par 1,609344. Limitations routières US souvent en mph.",
        knot_to_meter_per_second: "⛵ Nœud = vitesse maritime (1 mile nautique/heure) = 0,514444 m/s. 1 nœud ≈ 1,852 km/h.",
        mach_to_meter_per_second: "✈️ Mach 1 ≈ 343 m/s (vitesse du son à 20°C au niveau de la mer). Variable selon altitude et température.",
        speed_of_light_to_meter_per_second: "🌌 Vitesse de la lumière dans le vide = 299 792 458 m/s exactement (constante physique fondamentale)."
      };
      return speedNotes[conversionPair] || "🏃 Nœud = vitesse maritime (1 mille nautique/heure). Mach varie avec altitude/température. Vitesse lumière ≈ 299 792 458 m/s (constante physique). Limitations vitesse dépendent contexte local.";

    case "pressure":
      const pressureNotes: { [key: string]: string } = {
        bar_to_pascal: "🌀 1 bar ≈ pression atmosphérique standard au niveau de la mer = 100 000 Pa. Unité météorologique courante.",
        atmosphere_to_pascal: "🌍 Atmosphère standard = 101 325 Pa = pression au niveau de la mer à 15°C. Référence internationale.",
        psi_to_pascal: "🇺🇸 PSI = pression des pneus, compresseurs (pounds per square inch) = 6894,76 Pa.",
        mmhg_to_pascal: "🩺 mmHg (Torr) = 133,322 Pa. Unité médicale (pression artérielle) et météorologique historique.",
        inhg_to_pascal: "🌡️ Pouce de mercure = 3386,39 Pa. Unité météorologique US (pression barométrique).",
        millibar_to_pascal: "☁️ Millibar = 100 Pa. Unité météorologique : 1013,25 mbar = pression atmosphérique standard."
      };
      return pressureNotes[conversionPair] || "🌀 1 bar ≈ pression atmosphérique niveau mer. PSI = pression pneus/compresseurs (livres/pouce²). mmHg = pression artérielle/baromètres. Attention : pression absolue vs relative (manométrique).";

    case "power":
      return "⚡ Important : HP américain (745,7 W) ≠ PS européen (735,5 W). kW = 1000 W = puissance radiateur domestique. MW = puissance petite centrale/grosse éolienne.";

    case "time":
      const timeNotes: { [key: string]: string } = {
        year_to_day: "📅 Année = 365.25 jours (incluant années bissextiles). Année tropique = 365,2422 jours.",
        month_to_day: "🗓️ Mois = 30.44 jours (moyenne calendaire). RÉALITÉ : 28-31 jours selon mois et année bissextile.",
        week_to_day: "📆 Semaine = 7 jours exactement. Standard international depuis calendrier julien.",
        day_to_hour: "🌅 Jour = 24 heures (jour solaire moyen). Jour sidéral = 23h 56min 4s.",
        hour_to_minute: "🕐 Heure = 60 minutes = 3600 secondes. Division babylonienne en base 60.",
        minute_to_second: "⏱️ Minute = 60 secondes. Seconde = durée de 9 192 631 770 périodes de radiation du césium-133."
      };
      return timeNotes[conversionPair] || "⏰ 1 année = 365.25 jours (incluant bissextiles). 1 mois ≈ 30.44 jours (moyenne calendaire). Durées astronomiques varient (année tropique, sidérale...). Attention fuseaux horaires pour calculs dates.";

    case "currency":
      return "💱 ⚠️ ATTENTION : Taux approximatifs - NON utilisables pour transactions réelles. Les taux fluctuent constamment selon marchés financiers. Pour conversions précises, consultez votre banque ou API financières. Frais de change non inclus.";

    case "data":
      const dataNotes: { [key: string]: string } = {
        kilobyte_to_byte: "💾 Ambiguïté historique : KB = 1024 B (binaire) ou 1000 B (décimal). Standard SI = 1000, mais OS souvent 1024.",
        megabyte_to_byte: "💿 MB : 1 000 000 B (fabricants) vs 1 048 576 B (système). D'où écart capacité annoncée/réelle des disques.",
        gigabyte_to_byte: "💽 GB : 1 milliard B (marketing) vs 1 073 741 824 B (binaire). Différence ≈ 7% sur disques durs.",
        kibibyte_to_byte: "🔢 KiB (kibioctet) = 1024 B exactement. Standard IEC pour éviter confusion avec kB décimal.",
        bit_to_byte: "🔢 8 bits = 1 octet (byte). Bit = plus petite unité d'information (0 ou 1)."
      };
      return dataNotes[conversionPair] || "💾 Confusion fréquente : fabricants utilisent base 10 (kB=1000B) mais systèmes base 2 (KB=1024B). Standard IEC : KiB, MiB, GiB (binaire).";

    default:
      return "ℹ️ Conversion standard basée sur les facteurs de conversion officiels.";
  }
};
