const { Pool } = require('pg')
const jwt = require('jsonwebtoken')

const pool = new Pool({connectionString: process.env.DATABASE_URL})
const SEASON_END = process.env.SEASON_END_DATE || (()=>{const y=new Date().getFullYear(); return `${y}-03-31`})()

function computeScoreToPar(gross, par){ return gross - par }

// helper: get best results and leaderboards

async function getPublicData(){
  const client = await pool.connect()
  try{
    // active courses
    const coursesRes = await client.query('SELECT id, name, type, par, active FROM courses WHERE active = true ORDER BY name')
    const courses = coursesRes.rows
    // players with at least one result
    const playersRes = await client.query(`SELECT p.id, p.name, p.active, MIN(r.created_at) as first_played FROM players p JOIN rounds r ON r.player_id = p.id GROUP BY p.id, p.name, p.active ORDER BY p.name`)
    const players = playersRes.rows

    // best result per player per course (score_to_par)
    const bestRes = await client.query(`
      SELECT r.player_id, r.course_id, MIN(r.gross_strokes - c.par) as best_score_to_par, MIN(r.gross_strokes) as gross_of_best, MIN(r.played_at) as played_at
      FROM rounds r JOIN courses c ON c.id = r.course_id
      GROUP BY r.player_id, r.course_id
    `)
    const best = bestRes.rows

    // build leaderboards per course
    const leaderboards = {}
    for(const c of courses){
      const entries = best.filter(b=>b.course_id===c.id).map(b=>({player_id:b.player_id, score_to_par: parseInt(b.best_score_to_par), gross:b.gross_of_best, played_at:b.played_at}))
      entries.sort((a,b)=> a.score_to_par - b.score_to_par)
      leaderboards[c.id]=entries
    }

    // points mapping
    const points18 = [100,80,65,55,47,40,34,29,25,21]
    const pointsPar3 = [43,34,28,24,20,17,15,12,11,9]

    // compute best per player overall
    // collect players who have at least one best
    const playerMap = {}
    for(const p of players) playerMap[p.id]={id:p.id,name:p.name,active:p.active}

    // compute points per player
    const playerPoints = {}
    for(const pid of Object.keys(playerMap)){
      playerPoints[pid]={id:pid,name:playerMap[pid].name,points_18:0,points_par3:0,best_score_to_par:null,per_course:{}}
    }

    // helper for awarding points with skip ranking
    function awardPointsForCourse(course){
      const entries = leaderboards[course.id] || []
      // assign ranks with skip ranking
      let rank = 1
      let i = 0
      while(i<entries.length){
        // find ties
        const tieScore = entries[i].score_to_par
        const tieGroup = []
        while(i<entries.length && entries[i].score_to_par===tieScore){ tieGroup.push(entries[i]); i++ }
        // award points for rank to all in group
        const pos = rank
        const pointTable = (course.type==='18-hole') ? points18 : pointsPar3
        const pts = pos<=10 ? pointTable[pos-1] : 0
        for(const e of tieGroup){
          const pid = e.player_id
          playerPoints[pid].per_course[course.id]= {score_to_par:e.score_to_par,points:pts,gross:e.gross,played_at:e.played_at}
          if(course.type==='18-hole') playerPoints[pid].points_18 += pts
          else playerPoints[pid].points_par3 += pts
          if(playerPoints[pid].best_score_to_par===null || e.score_to_par < playerPoints[pid].best_score_to_par) playerPoints[pid].best_score_to_par = e.score_to_par
        }
        rank += tieGroup.length
      }
    }

    for(const c of courses) awardPointsForCourse(c)

    // total
    const overall = Object.values(playerPoints).map(p=>({id:p.id,name:p.name,points_18:p.points_18,points_par3:p.points_par3,total_points:p.points_18 + p.points_par3,best_score_to_par: p.best_score_to_par===null? null : p.best_score_to_par}))

    // sort overall as required
    overall.sort((a,b)=>{
      if(b.total_points !== a.total_points) return b.total_points - a.total_points
      if(b.points_18 !== a.points_18) return b.points_18 - a.points_18
      const aBest = a.best_score_to_par===null? 9999 : a.best_score_to_par
      const bBest = b.best_score_to_par===null? 9999 : b.best_score_to_par
      return aBest - bBest
    })

    return {courses, players: players.map(p=>({id:p.id,name:p.name,active:p.active})), overall, leaderboards}
  } finally { client.release() }
}

exports.handler = async function(event){
  try{
    const data = await getPublicData()
    return {statusCode:200, body: JSON.stringify(data)}
  }catch(err){
    console.error(err)
    return {statusCode:500, body: JSON.stringify({message: 'Daten konnten nicht geladen werden.'})}
  }
}
