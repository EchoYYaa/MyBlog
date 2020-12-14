function bubbleSort(arr1){
    let tmp = {}
    for(let i=0;i<arr1.length;i++){
      for (let j = i; j > 0; j--) {
        if(arr1[j].blogTime > arr1[j-1].blogTime){
          tmp = arr1[j-1]
          arr1[j-1] = arr1[j]
          arr1[j]=tmp
        }
      }
    }
    return arr1
}

  module.exports = bubbleSort;