export function computeRanking(scores){
  // lower is better
  const entries = scores.map((s,i)=>({s,i})).sort((a,b)=> a.s-b.s)
  const ranks = Array(scores.length)
  let rank=1
  let i=0
  while(i<entries.length){
    const tie = [entries[i]]
    i++
    while(i<entries.length && entries[i].s===tie[0].s){ tie.push(entries[i]); i++ }
    for(const t of tie) ranks[t.i]=rank
    rank += tie.length
  }
  return ranks
}
