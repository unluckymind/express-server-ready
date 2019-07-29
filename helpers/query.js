CMS = (id) => {
    let banners = {
        get : "SELECT * FROM banners",
        getById : "SELECT * FROM banners WHERE id = ",
        insert : "INSERT INTO banners SET created_at = now(), ?",
        update: "UPDATE banners SET ? WHERE id = " + id,
        delete : "DELETE FROM banners WHERE id = "
    }
    let body = {
        get : "SELECT * FROM banners",        
    }
    return ({banners,body});
}

SAHABAT = (id) => {
    let members = {
        insertMember : "INSERT INTO members SET created_at = now(), ?",
        insertMemberUser : "INSERT INTO `member_users` SET created_at = now(), ?" + id,
        get : "SELECT * FROM members",
        getById : "SELECT * FROM members WHERE id = ",
        getPasswordByEmail : "SELECT password FROM members WHERE email = ",
        getMemberByEmail : "SELECT * FROM members WHERE email = ",
        getIdByCode : "SELECT id FROM members WHERE code = ",
        getIdCodeById : "SELECT id, code FROM members where id = ",
        userList : "select member_users.member_user_id, members.name, members.email, members.phone, members.image, members.dob, members.city, members.gender, member_users.creaeted_at, members.point from member_users join members on members.id = member_users.member_user_id where member_users.member_id = ",
        countMember : "SELECT COUNT(*) as rowcount FROM members where id = ",
        countByEmail : "SELECT COUNT(*) as emailExist FROM members WHERE email = ",
        update : "UPDATE members SET ? where id = " + id,
        updatePassword : "UPDATE members SET ? WHERE id = " + id,
        updateImage : "UPDATE members SET ? WHERE id = " + id
    }
    return ({members})
} 

module.exports = {
    CMS : CMS,
    SAHABAT : SAHABAT
};