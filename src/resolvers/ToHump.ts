interface obj {
  [key:string]: any
}

function toHump(name:string):string {
 return name.replace(/\_(\w)/g, function(all:string, letter:string){
   return letter.toUpperCase()
 });
}

export default (data:obj) => {
  let newData: obj = {}
  for(let i in data) {
    const tem = toHump(i)
    newData[tem] = data[i]
  }
  return newData
 }