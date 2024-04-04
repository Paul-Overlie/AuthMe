const express = require('express')
const bcrypt = require('bcryptjs')
const {Group, GroupImage, Membership, Venue, User}=require("../../db/models")
const Sequelize = require("sequelize")

const { setTokenCookie, requireAuth } = require('../../utils/auth');

const router = express.Router()

//Get all Groups
router.get("/", async(req, res, next)=>{
    let memberCount = await Membership.count()
    // console.log("memberCount", memberCount)
    let group = await Group.unscoped().findAll({
        include: [Membership, GroupImage.unscoped()]
    })
    
    let groups = []

    group.forEach((oup)=>{groups.push({
        id:oup.id,
        organizerId: oup.organizerId,
        name: oup.name,
        about: oup.about,
        type: oup.type,
        private: oup.private,
        city: oup.city,
        state: oup.state,
        createdAt: oup.createdAt,
        updatedAt:oup.updatedAt,
        numMembers: oup.Memberships.length,
        previewImage: oup.GroupImages[0].url
    })})

    let payload = {Groups: groups}
    res.json(payload)
})

//Get all Groups by Current User
router.get("/current", requireAuth, async(req, res, next)=>{
    // console.log(req.user.dataValues.id)
    let group = await Group.unscoped().findAll({
        where: {organizerId: req.user.dataValues.id},
        include: [Membership, GroupImage]
    })

    let groups = []

    group.forEach((oup)=>{groups.push({
        id:oup.id,
        organizerId: oup.organizerId,
        name: oup.name,
        about: oup.about,
        type: oup.type,
        private: oup.private,
        city: oup.city,
        state: oup.state,
        createdAt: oup.createdAt,
        updatedAt:oup.updatedAt,
        numMembers: oup.Memberships.length,
        previewImage: oup.GroupImages[0].url
    })})

    let payload = {Groups:groups}

    res.statusCode=200
    res.json(payload)
})

//Get details of a Group from an id
router.get("/:groupId", async (req, res, next)=>{
    let id = req.params.groupId
     let group = await Group.unscoped().findAll({
        where: {id: id},
        include: [Membership, GroupImage, User, Venue]
    })

    if(group.length===0){
        res.statusCode = 404
        let body = {message: "Group couldn't be found",}
        res.json(body)
    }

    let groups = []

    group.forEach((oup)=>{groups.push({
        id:oup.id,
        organizerId: oup.organizerId,
        name: oup.name,
        about: oup.about,
        type: oup.type,
        private: oup.private,
        city: oup.city,
        state: oup.state,
        createdAt: oup.createdAt,
        updatedAt:oup.updatedAt,
        numMembers: oup.Memberships.length,
        GroupImages: oup.GroupImages,
        Organizer: oup.User,
        Venues: oup.Venues
        
    })})

    res.statusCode=200
    res.json(groups[0])
})

//Create a Group
router.post("/", requireAuth, async (req, res, next)=>{
    let {name, about, type, private, city, state}= req.body
    try {let newGroup = await Group.create({
        organizerId: req.user.dataValues.id,
        name,
        about,
        type,
        private,
        city,
        state
    })
    console.log(newGroup)
    
    res.statusCode = 201
    res.json(newGroup)
}
    catch(error){
        res.statusCode=400
        res.json({
            "message": "Bad Request",
            "errors": {
              "name": "Name must be 60 characters or less",
              "about": "About must be 50 characters or more",
              "type": "Type must be 'Online' or 'In person'",
              "private": "Private must be a boolean",
              "city": "City is required",
              "state": "State is required",
            }
          })
    }
})

//Add an Image to a Group based on the Group's id
router.post("/:groupId/images", requireAuth, async(req,res,next)=>{
    let group = await Group.findOne({where: {id: req.params.groupId}})
    //no group from id
    console.log("Group", group)
    if(!group){
        res.statusCode=404
        res.json({message: "Group couldn't be found"})
    }
    //authorization
    if(group.organizerId!==req.user.dataValues.id){
        res.statusCode=403
        res.json({
            "message": "Forbidden"
          })
    }

    //creating image
    let {url, preview}=req.body
    let image = await GroupImage.create({
        url,
        preview,
        groupId: req.params.groupId
    })
    let payload = {
        id: image.id,
        url: image.url,
        preview: image.preview
    }
    res.statusCode=200
    res.json(payload)
})

//Edit a Group
router.put("/:groupId", requireAuth, async(req,res,next)=>{
    let group = await Group.unscoped().findOne({where: {id: req.params.groupId}})
    if(!group){
        res.statusCode=404
        res.json({message: "Group couldn't be found"})
    }

    //authorization
    if(group.organizerId!==req.user.dataValues.id){
        res.statusCode=403
        res.json({
            "message": "Forbidden"
          })
    }

    try{

        let {name, about, type, private, city, state}=req.body
        if(name){group.name=name}
        if(about){group.about=about}
        if(type){group.type=type}
        if(private){group.private=private}
        if(city){group.city=city}
        if(state){group.state=state}
        await group.save()
        
        res.statusCode=200
        res.json(group)
    } catch(error){
        res.statusCode=400
        res.json({
            "message": "Bad Request",
            "errors": {
              "name": "Name must be 60 characters or less",
              "about": "About must be 50 characters or more",
              "type": "Type must be 'Online' or 'In person'",
              "private": "Private must be a boolean",
              "city": "City is required",
              "state": "State is required",
            }
          })
    }
})

    //Delete a Group
router.delete("/:groupId", requireAuth, async(req,res,next)=>{
    let group = await Group.unscoped().findOne({where: {id: req.params.groupId}})
    if(!group){
        res.statusCode=404
        res.json({
            "message": "Group couldn't be found"
          })
    }

    //authorization
    if(group.organizerId!==req.user.dataValues.id){
        res.statusCode=403
        res.json({
            "message": "Forbidden"
          })
    }
    await group.destroy()
    res.statusCode=200
    res.json({
        "message": "Successfully deleted"
      })
})
    
module.exports = router