const express = require('express')
const bcrypt = require('bcryptjs')
const {Group, GroupImage, Membership, Venue, User, Event, EventImage, Attendance}=require("../../db/models")
const Sequelize = require("sequelize")

const { setTokenCookie, requireAuth } = require('../../utils/auth');

const router = express.Router()

//Get all Events
router.get("/", async(req,res)=>{
    let origin = await Event.findAll({
        include: [Attendance, EventImage, Venue, Group]
    })
    // console.log("origin", origin, "originId", origin.id)
    let events =[]

    origin.forEach((event)=>{
        // console.log("events", event.dataValues)
        events.push({
        id: event.id,
        groupId: event.groupId,
        venueId: event.venueId,
        name: event.name,
        type: event.type,
        startDate: event.startDate,
        endDate: event.endDate,
        numAttending: event.Attendances.length,
        previewImage: event.EventImages[0].url,
        Group: event.Group,
        Venue: event.Venue
    })})
    
    let payload = {Events: events}

    res.statusCode = 200
    res.json(payload)
})

module.exports = router