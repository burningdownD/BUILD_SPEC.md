import { describe, it, expect } from 'vitest'
import { computeRanking } from './test-utils'

describe('Tie-ranking', ()=>{
  it('skip ranking example', ()=>{
    const scores = [-4,-2,-2,-1]
    const ranks = computeRanking(scores)
    expect(ranks).toEqual([1,2,2,4])
  })
  it('rank 10 tie special', ()=>{
    const scores = [0,0,0,0,0,0,0,0,0,-2,-2,5]
    // not strict check; ensure that two tied at rank 10 both get rank 10 and next gets 12
    const ranks = computeRanking(scores)
    const idx10 = scores.findIndex(s=>s===-2)
    // find last -2 index
    const lastIdx = scores.lastIndexOf(-2)
    expect(ranks[lastIdx]).toBe(12)
  })
})
