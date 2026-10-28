/* Dados do sistema de personagens (sem React), usados no cliente e no servidor. Extraído de Character.tsx (v3). */

export type HairId = 'long' | 'afro' | 'short' | 'mohawk' | 'devilock' | 'pigtails' | 'curly' | 'bun' | 'ponytail' | 'bob' | 'spiky' | 'wild' | 'bald';
export type TopId = 'tee' | 'hoodie' | 'striped' | 'bomber' | 'tank' | 'shirt' | 'leather' | 'robe';
export type AccessoryId = 'cap' | 'partyhat' | 'crown' | 'headphones' | 'sunglasses' | 'bowtie' | 'chain' | 'witchhat' | 'santahat' | 'antennas' | 'catears' | 'roundglasses' | 'mustache' | 'scarf' | 'flower';
export type MakeupId = 'none' | 'corpse';
export type ExpressionId = 'feliz' | 'alegre' | 'piscadinha' | 'surpreso' | 'bravo' | 'triste' | 'convencido';
export type FaceId = 'redondo' | 'oval' | 'quadrado' | 'coracao' | 'bochechuda';
export type PresetId = 'f1' | 'f2' | 'm1' | 'm2' | 'h1' | 'et' | 'gr' | 'wi' | 'ni' | 'nr' | 'rei';
export type Facing = 'none' | 'left' | 'right';
export type Emote = 'none' | 'wave' | 'cheer';
export type CharacterView = 'full' | 'head' | 'bust' | 'torso' | 'neck';

export interface CharacterConfig {
  skin: string;
  face?: FaceId;
  hair: HairId;
  hairColor: string;
  top: TopId;
  topColor: string;
  pants: string;
  shoes: string;
  makeup?: MakeupId;
  expression?: ExpressionId;
  lashes?: boolean;
  accessories?: AccessoryId[];
  outline?: string;
}

export const VIEWS: Record<CharacterView, string> = {
  "full": "0 0 100 140",
  "head": "6 0 88 82",
  "bust": "8 0 84 108",
  "torso": "14 56 72 56",
  "neck": "14 34 72 60"
};

export const CATALOG = {
  "skins": [
    {
      "id": "porcelana",
      "name": "Porcelana",
      "hex": "#fde4d0"
    },
    {
      "id": "clara",
      "name": "Clara",
      "hex": "#f6d3b3"
    },
    {
      "id": "bege",
      "name": "Bege",
      "hex": "#e8b48a"
    },
    {
      "id": "media",
      "name": "Média",
      "hex": "#d29a68"
    },
    {
      "id": "morena",
      "name": "Morena",
      "hex": "#b97a48"
    },
    {
      "id": "escura",
      "name": "Escura",
      "hex": "#7a4b2c"
    },
    {
      "id": "retinta",
      "name": "Retinta",
      "hex": "#4a2b1a"
    },
    {
      "id": "ciano",
      "name": "Ciano",
      "hex": "#38d6e6"
    },
    {
      "id": "verde",
      "name": "Verde",
      "hex": "#84cc16"
    },
    {
      "id": "lilas",
      "name": "Lilás",
      "hex": "#c4b5fd"
    }
  ],
  "faces": [
    {
      "id": "redondo",
      "name": "Redondo"
    },
    {
      "id": "oval",
      "name": "Oval"
    },
    {
      "id": "quadrado",
      "name": "Quadrado"
    },
    {
      "id": "coracao",
      "name": "Coração"
    },
    {
      "id": "bochechuda",
      "name": "Bochechuda"
    }
  ],
  "hairs": [
    {
      "id": "long",
      "name": "Longo liso",
      "defaultColor": "#5a2a17"
    },
    {
      "id": "afro",
      "name": "Black power",
      "defaultColor": "#2e1a12"
    },
    {
      "id": "short",
      "name": "Curto",
      "defaultColor": "#8a5a2b"
    },
    {
      "id": "mohawk",
      "name": "Moicano",
      "defaultColor": "#f97316"
    },
    {
      "id": "devilock",
      "name": "Devilock",
      "defaultColor": "#141418"
    },
    {
      "id": "pigtails",
      "name": "Maria-chiquinha",
      "defaultColor": "#f2c14e"
    },
    {
      "id": "curly",
      "name": "Cacheado",
      "defaultColor": "#c2410c"
    },
    {
      "id": "bun",
      "name": "Coque",
      "defaultColor": "#2e1a12"
    },
    {
      "id": "ponytail",
      "name": "Rabo de cavalo",
      "defaultColor": "#f2c14e"
    },
    {
      "id": "bob",
      "name": "Chanel",
      "defaultColor": "#141418"
    },
    {
      "id": "spiky",
      "name": "Espetado",
      "defaultColor": "#a78bfa"
    },
    {
      "id": "wild",
      "name": "Selvagem",
      "defaultColor": "#65a30d"
    },
    {
      "id": "bald",
      "name": "Careca",
      "defaultColor": "#2e1a12"
    }
  ],
  "tops": [
    {
      "id": "tee",
      "name": "Camiseta",
      "defaultColor": "#f43f5e"
    },
    {
      "id": "hoodie",
      "name": "Moletom",
      "defaultColor": "#f59e0b"
    },
    {
      "id": "striped",
      "name": "Listrada",
      "defaultColor": "#38bdf8"
    },
    {
      "id": "bomber",
      "name": "Jaqueta bomber",
      "defaultColor": "#8b5cf6"
    },
    {
      "id": "tank",
      "name": "Regata",
      "defaultColor": "#4ade80"
    },
    {
      "id": "shirt",
      "name": "Camisa social",
      "defaultColor": "#f8fafc"
    },
    {
      "id": "leather",
      "name": "Jaqueta de couro",
      "defaultColor": "#26262c"
    },
    {
      "id": "robe",
      "name": "Manto",
      "defaultColor": "#6d28d9"
    }
  ],
  "accessories": [
    {
      "id": "cap",
      "name": "Boné",
      "group": "topo",
      "slot": "head"
    },
    {
      "id": "partyhat",
      "name": "Chapéu de festa",
      "group": "topo",
      "slot": "head"
    },
    {
      "id": "crown",
      "name": "Coroa",
      "group": "topo",
      "slot": "head"
    },
    {
      "id": "headphones",
      "name": "Fone",
      "group": "orelhas",
      "slot": "head"
    },
    {
      "id": "sunglasses",
      "name": "Óculos escuros",
      "group": "rosto",
      "slot": "face"
    },
    {
      "id": "bowtie",
      "name": "Gravata borboleta",
      "group": "pescoço",
      "slot": "body"
    },
    {
      "id": "chain",
      "name": "Corrente",
      "group": "pescoço",
      "slot": "body"
    },
    {
      "id": "witchhat",
      "name": "Chapéu de bruxa",
      "group": "topo",
      "slot": "head"
    },
    {
      "id": "santahat",
      "name": "Gorro de Natal",
      "group": "topo",
      "slot": "head"
    },
    {
      "id": "antennas",
      "name": "Antenas",
      "group": "topo",
      "slot": "head"
    },
    {
      "id": "catears",
      "name": "Orelhas de gato",
      "group": "topo",
      "slot": "head"
    },
    {
      "id": "roundglasses",
      "name": "Óculos redondos",
      "group": "rosto",
      "slot": "face"
    },
    {
      "id": "mustache",
      "name": "Bigode",
      "group": "boca",
      "slot": "face"
    },
    {
      "id": "scarf",
      "name": "Cachecol",
      "group": "pescoço",
      "slot": "body"
    },
    {
      "id": "flower",
      "name": "Flor",
      "group": "lateral",
      "slot": "head"
    }
  ],
  "expressions": [
    {
      "id": "feliz",
      "name": "Feliz"
    },
    {
      "id": "alegre",
      "name": "Alegre"
    },
    {
      "id": "piscadinha",
      "name": "Piscadinha"
    },
    {
      "id": "surpreso",
      "name": "Surpreso"
    },
    {
      "id": "bravo",
      "name": "Bravo"
    },
    {
      "id": "triste",
      "name": "Triste"
    },
    {
      "id": "convencido",
      "name": "Convencido"
    }
  ],
  "makeups": [
    {
      "id": "none",
      "name": "Natural"
    },
    {
      "id": "corpse",
      "name": "Corpse paint"
    }
  ],
  "hairColors": [
    "#141418",
    "#2e1a12",
    "#5a2a17",
    "#8a5a2b",
    "#f2c14e",
    "#c2410c",
    "#f97316",
    "#f472b6",
    "#a78bfa",
    "#38bdf8",
    "#4ade80",
    "#e2e8f0",
    "#dc2626",
    "#65a30d",
    "#5b21b6"
  ],
  "clothColors": [
    "#f43f5e",
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#facc15",
    "#4ade80",
    "#14b8a6",
    "#38bdf8",
    "#3b82f6",
    "#6366f1",
    "#8b5cf6",
    "#f472b6",
    "#f8fafc",
    "#26262c",
    "#b91c1c",
    "#3f3f46"
  ]
} as const;

export const PRESETS: Record<PresetId, CharacterConfig & { name: string }> = {
  "f1": {
    "name": "Feminino A",
    "skin": "#d29a68",
    "face": "redondo",
    "hair": "long",
    "hairColor": "#5a2a17",
    "top": "tee",
    "topColor": "#f43f5e",
    "pants": "#3b82f6",
    "shoes": "#f8fafc",
    "makeup": "none",
    "expression": "feliz",
    "lashes": true,
    "accessories": []
  },
  "f2": {
    "name": "Feminino B",
    "skin": "#7a4b2c",
    "face": "redondo",
    "hair": "afro",
    "hairColor": "#2e1a12",
    "top": "hoodie",
    "topColor": "#f59e0b",
    "pants": "#6366f1",
    "shoes": "#f8fafc",
    "makeup": "none",
    "expression": "feliz",
    "lashes": true,
    "accessories": []
  },
  "m1": {
    "name": "Masculino A",
    "skin": "#f6d3b3",
    "face": "redondo",
    "hair": "short",
    "hairColor": "#8a5a2b",
    "top": "striped",
    "topColor": "#38bdf8",
    "pants": "#2563eb",
    "shoes": "#ef4444",
    "makeup": "none",
    "expression": "feliz",
    "lashes": false,
    "accessories": []
  },
  "m2": {
    "name": "Masculino B",
    "skin": "#b97a48",
    "face": "redondo",
    "hair": "mohawk",
    "hairColor": "#f97316",
    "top": "bomber",
    "topColor": "#8b5cf6",
    "pants": "#14b8a6",
    "shoes": "#f8fafc",
    "makeup": "none",
    "expression": "feliz",
    "lashes": false,
    "accessories": []
  },
  "h1": {
    "name": "Horror Punk",
    "skin": "#f6d3b3",
    "face": "redondo",
    "hair": "devilock",
    "hairColor": "#141418",
    "top": "leather",
    "topColor": "#26262c",
    "pants": "#b91c1c",
    "shoes": "#26262c",
    "makeup": "corpse",
    "expression": "feliz",
    "lashes": false,
    "accessories": [
      "chain"
    ]
  },
  "et": {
    "name": "Alienígena",
    "skin": "#38d6e6",
    "face": "coracao",
    "hair": "spiky",
    "hairColor": "#dc2626",
    "top": "tee",
    "topColor": "#a3e635",
    "pants": "#7c3aed",
    "shoes": "#facc15",
    "makeup": "none",
    "expression": "surpreso",
    "lashes": false,
    "accessories": [
      "antennas"
    ]
  },
  "gr": {
    "name": "Rabugento Verde",
    "skin": "#84cc16",
    "face": "quadrado",
    "hair": "wild",
    "hairColor": "#65a30d",
    "top": "hoodie",
    "topColor": "#dc2626",
    "pants": "#3f3f46",
    "shoes": "#26262c",
    "makeup": "none",
    "expression": "convencido",
    "lashes": false,
    "accessories": [
      "santahat"
    ]
  },
  "wi": {
    "name": "Bruxa",
    "skin": "#fde4d0",
    "face": "oval",
    "hair": "long",
    "hairColor": "#141418",
    "top": "robe",
    "topColor": "#6d28d9",
    "pants": "#26262c",
    "shoes": "#26262c",
    "makeup": "none",
    "expression": "convencido",
    "lashes": true,
    "accessories": [
      "witchhat"
    ]
  },
  "ni": {
    "name": "Gatinha",
    "skin": "#e8b48a",
    "face": "bochechuda",
    "hair": "bun",
    "hairColor": "#f472b6",
    "top": "tee",
    "topColor": "#a78bfa",
    "pants": "#14b8a6",
    "shoes": "#f8fafc",
    "makeup": "none",
    "expression": "alegre",
    "lashes": true,
    "accessories": [
      "catears"
    ]
  },
  "nr": {
    "name": "Nerd",
    "skin": "#d29a68",
    "face": "redondo",
    "hair": "short",
    "hairColor": "#141418",
    "top": "shirt",
    "topColor": "#f8fafc",
    "pants": "#3f3f46",
    "shoes": "#26262c",
    "makeup": "none",
    "expression": "feliz",
    "lashes": false,
    "accessories": [
      "roundglasses",
      "bowtie"
    ]
  },
  "rei": {
    "name": "Rei",
    "skin": "#f6d3b3",
    "face": "bochechuda",
    "hair": "bald",
    "hairColor": "#8a5a2b",
    "top": "robe",
    "topColor": "#b91c1c",
    "pants": "#26262c",
    "shoes": "#facc15",
    "makeup": "none",
    "expression": "convencido",
    "lashes": false,
    "accessories": [
      "crown",
      "mustache"
    ]
  }
};
