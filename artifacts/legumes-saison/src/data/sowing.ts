export type ActionType = 'indoor' | 'outdoor' | 'transplant' | 'harvest';

export interface SowingEntry {
  vegetable: string;
  // For each month 0-11, what actions happen (for Centre region)
  months: Partial<Record<number, ActionType[]>>;
}

export const SOWING_DATA: SowingEntry[] = [
  {
    vegetable: "Tomate",
    months: {
      1: ['indoor'], 2: ['indoor'], 4: ['transplant'], 6: ['harvest'], 7: ['harvest'], 8: ['harvest'], 9: ['harvest']
    }
  },
  {
    vegetable: "Courgette",
    months: {
      3: ['indoor'], 4: ['indoor', 'outdoor'], 5: ['outdoor'], 6: ['harvest'], 7: ['harvest'], 8: ['harvest']
    }
  },
  {
    vegetable: "Carotte",
    months: {
      2: ['outdoor'], 3: ['outdoor'], 4: ['outdoor'], 5: ['outdoor', 'harvest'], 6: ['outdoor', 'harvest'], 7: ['harvest'], 8: ['harvest'], 9: ['harvest']
    }
  },
  {
    vegetable: "Laitue",
    months: {
      1: ['indoor'], 2: ['indoor'], 3: ['outdoor', 'transplant'], 4: ['outdoor', 'transplant', 'harvest'], 5: ['outdoor', 'transplant', 'harvest'], 6: ['outdoor', 'harvest'], 7: ['outdoor', 'harvest'], 8: ['harvest']
    }
  },
  {
    vegetable: "Haricot vert",
    months: {
      4: ['outdoor'], 5: ['outdoor'], 6: ['outdoor', 'harvest'], 7: ['harvest'], 8: ['harvest']
    }
  },
  {
    vegetable: "Radis",
    months: {
      2: ['outdoor'], 3: ['outdoor', 'harvest'], 4: ['outdoor', 'harvest'], 5: ['outdoor', 'harvest'], 6: ['outdoor', 'harvest'], 7: ['outdoor', 'harvest'], 8: ['outdoor', 'harvest'], 9: ['harvest']
    }
  },
  {
    vegetable: "Poireau",
    months: {
      1: ['indoor'], 2: ['indoor'], 3: ['indoor'], 5: ['transplant'], 6: ['transplant'], 9: ['harvest'], 10: ['harvest'], 11: ['harvest'], 0: ['harvest']
    }
  },
  {
    vegetable: "Oignon",
    months: {
      2: ['outdoor'], 3: ['outdoor', 'transplant'], 4: ['transplant'], 7: ['harvest'], 8: ['harvest']
    }
  },
  {
    vegetable: "Épinards",
    months: {
      2: ['outdoor'], 3: ['outdoor'], 4: ['harvest'], 5: ['harvest'], 7: ['outdoor'], 8: ['outdoor'], 9: ['outdoor', 'harvest'], 10: ['harvest']
    }
  },
  {
    vegetable: "Basilic",
    months: {
      2: ['indoor'], 3: ['indoor'], 4: ['indoor', 'transplant'], 5: ['transplant', 'harvest'], 6: ['harvest'], 7: ['harvest'], 8: ['harvest'], 9: ['harvest']
    }
  },
  {
    vegetable: "Persil",
    months: {
      2: ['outdoor'], 3: ['outdoor'], 4: ['outdoor', 'harvest'], 5: ['outdoor', 'harvest'], 6: ['harvest'], 7: ['harvest'], 8: ['harvest'], 9: ['harvest'], 10: ['harvest']
    }
  },
  {
    vegetable: "Concombre",
    months: {
      3: ['indoor'], 4: ['indoor', 'outdoor'], 5: ['outdoor', 'transplant'], 6: ['harvest'], 7: ['harvest'], 8: ['harvest']
    }
  }
];
