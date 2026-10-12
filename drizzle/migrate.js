// migrate.js - applies SQL migrations in drizzle/migrations
const fs = require('fs')
const path = require('path')
const { Client } = require('pg')

async function main(){
  const url = process.env.DATABASE_URL
  if(!url){ console.error('DATABASE_URL fehlt'); process.exit(1)}
  const client = new Client({connectionString: url})
  await client.connect()
  try{
    const dir = path.join(__dirname,'migrations')
    const files = fs.readdirSync(dir).filter(f=>f.endsWith('.sql')).sort()
    for(const f of files){
      const sql = fs.readFileSync(path.join(dir,f),'utf8')
      console.log('Applying',f)
      await client.query(sql)
    }
    console.log('Migrations applied')
  }finally{await client.end()}
}

main().catch(e=>{console.error(e); process.exit(1)})
