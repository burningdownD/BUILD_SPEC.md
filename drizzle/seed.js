// seed.js - seeds example courses (run manually)
const { Client } = require('pg')

async function main(){
  const url = process.env.DATABASE_URL
  if(!url){ console.error('DATABASE_URL fehlt'); process.exit(1)}
  const client = new Client({connectionString: url})
  await client.connect()
  try{
    const courses = [
      {name:'18-Loch Platz 1', type:'18-hole', par:72},
      {name:'18-Loch Platz 2', type:'18-hole', par:71},
      {name:'18-Loch Platz 3', type:'18-hole', par:70},
      {name:'18-Loch Platz 4', type:'18-hole', par:69},
      {name:'Par3 Platz 1', type:'short/par3', par:27},
      {name:'Par3 Platz 2', type:'short/par3', par:30},
      {name:'Par3 Platz 3', type:'short/par3', par:27},
      {name:'Par3 Platz 4', type:'short/par3', par:27}
    ]
    for(const c of courses){
      await client.query('INSERT INTO courses(id,name,type,par,active,created_at) VALUES (gen_random_uuid(), $1,$2,$3,true,now())', [c.name,c.type,c.par])
    }
    console.log('Seed complete')
  }finally{await client.end()}
}

main().catch(e=>{console.error(e); process.exit(1)})
