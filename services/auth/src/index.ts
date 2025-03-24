import express from "express"
import dotenv from "dotenv"

const app = express()
dotenv.config()

const PORT = process.env.PORT || 5001
app.listen(PORT,() => {
    console.log(`server is running on http://localhost:${PORT}`)
})