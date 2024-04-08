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
        // console.log("Group:", event.Group, "Venue:",event.Venue)
        // console.log("PASSED HERE")
        let gru = null
        if(event.Group){
            gru = {
                id:event.Group.id,
                name:event.Group.name,
                city:event.Group.city,
                state:event.Group.state
            }
        }
        let ven = null
        if(event.Venue){
            ven = {
                id:event.Venue.id,
                city:event.Venue.city,
                state:event.Venue.state
            }
        }
        let prev = []
        event.EventImages.forEach((img)=>{
            if(img.preview===true){prev.push(img.url)}
        })
        if(prev[0]){prev=prev[0]}else{prev=null}
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
        previewImage: prev,
        Group: gru,
        Venue: ven
    })})
    
    let payload = {Events: events}

    res.statusCode = 200
    return res.json(payload)
})

//Get details of an Event specified by its id
router.get("/:eventId", async(req,res)=>{
    let event = await Event.findOne({where:{id:req.params.eventId},
    include: [Attendance, Group, Venue, EventImage]})
    if(!event){
        res.statusCode=404
        return res.json({message: "Event couldn't be found"})
    }

    let {id, groupId, venueId, name, description, type, capacity, price, startDate, endDate}=event
    let payload = {
        id,
        groupId,
        venueId,
        name,
        description,
        type,
        capacity,
        price,
        startDate,
        endDate,
        numAttending:event.Attendances.length,
        Group: {id:event.Group.id,
            name:event.Group.name,
            private: event.Group.private,
            city:event.Group.city,
            state:event.Group.state},
        Venue: {id:event.Venue.id,
            address:event.Venue.address,
            city:event.Venue.city,
            state:event.Venue.state,
            lat:event.Venue.lat,
            lng:event.Venue.lng},
        EventImages: []
    }

    event.EventImages.forEach((img)=>{
        payload.EventImages.push({
            id:img.id,
            url:img.url,
            preview:img.preview
        })
    })

    res.statusCode=200
    return res.json(payload)
})

//Add an Image to an Event based on the Event's id
router.post("/:eventId/images", requireAuth, async(req,res)=>{
    let event = await Event.unscoped().findOne({where: {id: req.params.eventId},
    include: [Group]})
    
    if(!event){res.statusCode = 404
        return res.json({message: "Event couldn't be found"})}

        //authorization
        let auth = false
        let attendance = await Attendance.findOne({where:{userId:req.user.dataValues.id, eventId:event.id}})
        let membership = await Membership.findOne({where:{groupId:event.groupId,
        userId:req.user.dataValues.id}})
            // console.log("status:",membership.status,"Id:",membership.userId,"realId:",req.user.dataValues.id)
            if(membership)
            {if(membership.status==="co-host"){auth=true}}
        
    if(attendance&&attendance.status==="attending"){auth=true}
    if(event.Group)
    {if(event.Group.organizerId===req.user.dataValues.id){auth=true}}
    if(auth===false){
        res.statusCode=403
        return res.json({
            "message": "Forbidden"
          })
    }

    let {url, preview}=req.body
    let img = await EventImage.create({
        url: url,
        preview: preview,
        eventId: req.params.eventId
    })

    let payload = {
        id: img.id,
        url: img.url,
        preview: img.preview
    }

    res.statusCode=200
    return res.json(payload)
})

//Edit an Event specified by its id
router.put("/:eventId", requireAuth, async(req,res)=>{
    let event = await Event.findOne({where:{id:req.params.eventId}})
    if(!event){res.statusCode=404
    return res.json({message: "Event couldn't be found"})}
    let group = await Group.findOne({where: {id:event.groupId},
    include: [Membership]})
    let attend = await Attendance.findOne({where:{eventId:req.params.eventId,
    userId:req.user.dataValues.id}})
    
    //authorize
    let auth=false
    group.Memberships.forEach((member)=>{
        if(member.userId===req.user.dataValues.id&&member.status==="co-host")
        {auth=true}
    })
    if(req.user.dataValues.id===group.organizerId){auth=true}
    if(attend)
    {if(attend.status==='attending'){auth=true}}
    if(auth===false){
        res.statusCode=403
        return res.json({
            "message": "Forbidden"
        })
    }
    let {venueId, name, type, capacity, price, description, startDate, endDate}=req.body

    let venue = await Venue.findOne({where:{id:venueId}})
    if(!venue){
        res.statusCode=404
        return res.json({message: "Venue couldn't be found"})
    }

    if(venueId){event.venueId = venueId}
    if(name)event.name = name
    if(type)event.type=type
    if(capacity)event.capacity=capacity
    if(price)event.price=price
    if(description)event.description=description
    if(startDate)event.startDate=startDate
    if(endDate)event.endDate=endDate
    try{
        await event.save()

        let payload = {
            id:event.id,
            groupId:event.groupId,
            venueId:event.venueId,
            name:event.name,
            type:event.type,
            capacity:event.capacity,
            price:event.price,
            description:event.description,
            startDate:event.startDate,
            endDate:event.endDate
        }
        
        res.statusCode=200
        return res.json(payload)
    }catch(err){
        res.statusCode=400
        return res.json({
            "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
            "errors": {
              "name": "Name must be at least 5 characters",
              "type": "Type must be Online or In person",
              "capacity": "Capacity must be an integer",
              "price": "Price is invalid",
              "description": "Description is required",
              "startDate": "Start date must be in the future",
              "endDate": "End date is less than start date",
            }
          })
    }

})

//Delete an Event specified by its id
router.delete("/:eventId", requireAuth, async(req,res)=>{
    let event = await Event.findOne({where:{id:req.params.eventId}})

    if(!event){res.statusCode=404
    return res.json({message: "Event couldn't be found"})}

    let group = await Group.findOne({where:{id:event.groupId},
    include: [Membership]})
    //authorize
    let auth=false
    group.Memberships.forEach((member)=>{
        if(member.userId===req.user.dataValues.id&&member.status==="co-host")
        {auth=true}
    })
    if(req.user.dataValues.id===group.organizerId){auth=true}
    if(auth===false){
        res.statusCode=403
        return res.json({
            "message": "Forbidden"
        })
    }

    await event.destroy()
    res.statusCode=200
    return res.json({message: "Successfully deleted"})
})

//Get all Attendees of an Event specified by its id
router.get("/:eventId/attendees", async(req,res)=>{
    console.log(1)
    let event = await Event.findOne({where:{id:req.params.eventId}})
    if(!event){res.statusCode=404
    return res.json({message:"Event couldn't be found"})}
    console.log(2)
    let group = await Group.findOne({where:{id:event.groupId},
    include:[Membership]})
    console.log(3)
    let attendance = await Attendance.findAll({where:{eventId:req.params.eventId},
    include: [User]})
    console.log(4)
    // console.log("userId:",req.user.dataValues.id,"organizerId:",group.organizerId)

    //is organizer or a co-host
        let elite = false
        if(group&&req.user.dataValues.id===group.organizerId){elite=true}
        group.Memberships.forEach((member)=>{
            if(member.userId===req.user.dataValues.id&&member.status==="co-host")
            {elite=true}
        })
        console.log(5)
        if(elite===true){
            let attend = {Attendees: []}
            attendance.forEach((at)=>{
                attend.Attendees.push({
                    id:at.User.id,
                    firstName:at.User.firstName,
                    lastName:at.User.lastName,
                    Attendance: {status:at.status}
                })
                console.log(6)
            })
            console.log(7)
            res.statusCode=200
            return res.json(attend)

        } else {
            console.log(8)
            let attends = {Attendees: []}
            attendance.forEach((att)=>{
                if(att.status!=="pending"){
                    attends.Attendees.push({
                        id:att.User.id,
                        firstName:att.User.firstName,
                        lastName:att.User.lastName,
                        Attendance: {status:att.status}
                    })
                    console.log(9)
                }
                console.log(10)
            })
            res.statusCode=200
            return res.json(attends)
        }

})

//Request to Attend an Event based on the Event's id
router.post("/:eventId/attendance", requireAuth, async(req,res)=>{
    let event = await Event.findOne({where:{id:req.params.eventId}})
    if(!event){res.statusCode=404
    return res.json({message: "Event couldn't be found"})}
    let group = await Group.findOne({where:{id:event.groupId},
    include: [Membership]})

    let attendance = await Attendance.findOne({where:{eventId:event.id,
    userId:req.user.dataValues.id}})

    //authorize
    let auth=false
    
    group.Memberships.forEach((member)=>{
        // console.log("user:", req.user.dataValues.id,
        // "memberId:", member.userId,
        // "status:",member.status)
        if(member)
        {if(req.user.dataValues.id===member.userId&&(member.status==="co-host"||member.status==="member")){auth=true}}

        // console.log("current user:",req.user.dataValues.id,"userId:",attendance.userId,"status:",attendance.status)
        if(attendance)
        {if(req.user.dataValues.id===attendance.userId&&attendance.status==="pending")
        {res.statusCode=400
        return res.json({message:"Attendance has already been requested"})}
        if(req.user.dataValues.id===attendance.userId&&attendance.status==="attending")
        {res.statusCode=400
        return res.json({message: "User is already an attendee of the event"})}}
    })
    if(auth===false){
        res.statusCode=403
        return res.json({
            "message": "Forbidden"
        })
    }

    

    let request = await Attendance.create({
        eventId:req.params.eventId,
        userId: req.user.dataValues.id,
        status: "pending"
    })
    let payload = {
        userId:request.userId,
        status:request.status
    }

    res.statusCode=200
    return res.json(payload)
})

//Change the status of an attendance for an event specified by id
router.put("/:eventId/attendance", requireAuth, async(req,res)=>{
    let event = await Event.findOne({where:{id:req.params.eventId},
    include: [Group]})
    if(!event){res.statusCode=404
    return res.json({message: "Event couldn't be found"})}
    let member = await Membership.findAll({where:{groupId:event.Group.id}})

    
    
    //authorize
    let auth = false
    if(event.Group.organizerId===req.user.dataValues.id){auth=true}
    member.forEach((mem)=>{
        // console.log("organizerId:",event.Group.organizerId,
        // "userId:",req.user.dataValues.id,
        // "member'sUserId:",mem.userId,
        // "memberStatus:",mem.status)
        // console.log("mem:",mem)
        if(mem.userId===req.user.dataValues.id&&mem.status==="co-host"){auth=true}
    })
    if(auth===false){
        res.statusCode=403
        return res.json({
            "message": "Forbidden"
        })
    }

    let {userId, status}=req.body

    let user = await User.findOne({where:{id:userId}})
    if(!user){res.statusCode=404
    return res.json({message: "User couldn't be found"})}
    if(status==="pending"){res.statusCode=400
    return res.json({
        "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
        "errors": {
          "status" : "Cannot change an attendance status to pending"
        }
      })}

    let attendance = await Attendance.findOne({where:{userId:userId}})
    if(!attendance){res.statusCode=404
    return res.json({
        "message": "Attendance between the user and the event does not exist"
      })}
    attendance.status=status
    await attendance.save()

    let payload = {
        id:attendance.id,
        eventId:attendance.eventId,
        userId:attendance.userId,
        status:attendance.status
    }

    res.statusCode=200
    return res.json(payload)
})

//Delete attendance to an event specified by id
router.delete("/:eventId/attendance/:userId", requireAuth, async(req,res)=>{
    let event = await Event.findOne({where:{id:req.params.eventId},
    include: [Group]})
    if(!event){res.statusCode=404
    return res.json({message: "Event couldn't be found"})}
    let user = await User.findOne({where:{id:req.params.userId}})
    if(!user){res.statusCode=404
    return res.json({message: "User couldn't be found"})}

    let attendance = await Attendance.findOne({where:{userId:req.user.dataValues.id,
    eventId:req.params.eventId}})
    if(!attendance){req.statusCode=404
    return res.json({message: "Attendance does not exist for this User"})}
    await attendance.destroy()
    

    //authorize
    let auth = false
    if(event.Group.organizerId===req.user.dataValues.id){auth=true}
    if(+req.params.userId===req.user.dataValues.id){auth=true}
    if(auth===false){
        res.statusCode=403
        return res.json({
            "message": "Forbidden"
        })
    }    

    res.statusCode=200
    return res.json({
        "message": "Successfully deleted attendance from event"
      })
})

module.exports = router