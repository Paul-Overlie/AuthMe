const express = require('express')
const bcrypt = require('bcryptjs')
const {Group, GroupImage, Membership}=require("../../db/models")
const Sequelize = require("sequelize")

const { setTokenCookie, requireAuth } = require('../../utils/auth');

const router = express.Router()

router.get("/", async(req, res, next)=>{
    let memberCount = await Membership.count()
    console.log("memberCount", memberCount)
    let group = await Group.unscoped().findAll({
        // incude: GroupImage,
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

    let payload = {Groups: groups}
    res.json(payload)
})

module.exports = router