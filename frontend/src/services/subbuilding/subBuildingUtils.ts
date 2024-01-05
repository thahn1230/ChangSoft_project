type gridData = Array<{ [key: string]: any } & { "": string }>;

const getGridFromPivotData = (pivotData: Record<string, unknown>): gridData => {
  return Object.entries(pivotData).map(([key, value]) => {
    const newObj: Record<string, unknown> = { "": key };

    if (typeof value === 'object' && value !== null) {
      for (const prop in value as Record<string, unknown>) {
        newObj[prop] = (value as Record<string, unknown>)[prop];
      }
    }

    return newObj as { [key: string]: any } & { "": string };
  });
};

const getRebarGridFromPivotData = (rebarData:any) => {
  const rebarJsonPivotGrid:gridData = [];

  for (const rebar of rebarData) {
    const componentType = rebar.component_type;
    const rebarGrade = rebar.rebar_grade;
    const rebarDiameter = rebar.rebar_diameter;
    const totalWeight = rebar.total_weight;

    const existingItem = rebarJsonPivotGrid.find(
      (item) => item[""] === componentType
    );

    if (existingItem) {
      if (!existingItem[rebarGrade]) {
        existingItem[rebarGrade] = {};
      }
      existingItem[rebarGrade][rebarDiameter.toString()] = totalWeight;
    } else {
      const newItem = {
        "": componentType,
        [rebarGrade]: {
          [rebarDiameter.toString()]: totalWeight,
        },
      };
      rebarJsonPivotGrid.push(newItem);
    }
  }

  return rebarJsonPivotGrid;
};
const getFloorRebarGridFromPivotData = (rebarData:any) => {
  const rebarJsonGrid:gridData = [];
  for (const rebar of rebarData) {
    const floorName = rebar.floor_name;
    const rebarGrade = rebar.rebar_grade;
    const rebarDiameter = rebar.rebar_diameter;
    const totalRebar = rebar.total_rebar;

    const existingItem = rebarJsonGrid.find((item) => item[""] === floorName);
    if (existingItem) {
      if (!existingItem[rebarGrade]) {
        existingItem[rebarGrade] = {};
      }
      existingItem[rebarGrade][rebarDiameter.toString()] = totalRebar;
    } else {
      const newItem = {
        "": floorName,
        [rebarGrade]: {
          [rebarDiameter.toString()]: totalRebar,
        },
      };
      rebarJsonGrid.push(newItem);
    }
  }

  return rebarJsonGrid;
};

const getRebarColumnsFromData = (rebarData: any[]): any[] => {
  const temp: string[] = [];
  const rebarColumns: any[] = [{}];

  rebarData.forEach((item) => {
    Object.entries(item).forEach(([key]) => {
      temp.push(key);
    });
  });

  temp.sort();
  const tempSet = new Set(temp);

  Array.from(tempSet).forEach((strength) => {
    const DiametersInStrength = rebarData.reduce((keys: string[], obj) => {
      for (const key in obj) {
        if (key === strength) {
          keys.push(...Object.keys(obj[key]));
        }
      }
      keys.sort();
      const keysSet = new Set(keys);
      return Array.from(keysSet);
    }, []);

    rebarColumns.push({ [strength]: DiametersInStrength });
  });

  return rebarColumns;
};


const getRebarDataWithoutSubkey = (rebarData: any[]):gridData => {
  const temp: string[] = [];
  const rebarColumns: any[] = [{}];

  rebarData.forEach((item) => {
    Object.entries(item).forEach(([key]) => {
      temp.push(key);
    });
  });

  temp.sort();
  const tempSet = new Set(temp);

  Array.from(tempSet).forEach((strength) => {
    const DiametersInStrength = rebarData.reduce((keys: string[], obj) => {
      for (const key in obj) {
        if (key === strength) {
          keys.push(...Object.keys(obj[key]));
        }
      }
      keys.sort();
      const keysSet = new Set(keys);
      return Array.from(keysSet);
    }, []);

    rebarColumns.push({ [strength]: DiametersInStrength });
  });

  return rebarColumns;
};

export {
  getGridFromPivotData,
  getRebarGridFromPivotData,
  getFloorRebarGridFromPivotData,
  getRebarColumnsFromData,
  getRebarDataWithoutSubkey,
};
