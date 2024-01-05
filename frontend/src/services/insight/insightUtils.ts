const getIntruction = (selectedInsightIndexInList:number) => {
  let instruction = "";
  switch (selectedInsightIndexInList + 1) {
    case 1:
    case 2:
    case 3:
    case 5:
      instruction = "한 개의 건설사만 선택해주세요";
      break;
    case 4:
      instruction = "비교할 건설사들을 선택해주세요";
      break;
    case 6:
      instruction = "한 개의 빌딩만 선택해주세요";
      break;
    default:
      instruction = "";
  }
  return instruction;
};

export { getIntruction };
