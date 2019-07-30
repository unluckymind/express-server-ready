CMS = (id) => {
    let banners = {
        get: "SELECT * FROM banners",
        getById: "SELECT * FROM banners WHERE id = ",
        insert: "INSERT INTO banners SET created_at = now(), ?",
        update: "UPDATE banners SET ? WHERE id = " + id,
        delete: "DELETE FROM banners WHERE id = "
    }

    return ({ banners });
}

SAHABAT = (id, data) => {
    let members = {
        insertMember: "INSERT INTO members SET created_at = now(), ?",
        insertMemberUser: `INSERT INTO member_users (member_id, member_user_id, creaeted_at) VALUES ('${id}', '${data}', now())`,
        get: "SELECT * FROM members",
        getById: "SELECT * FROM members WHERE id = ",
        getPasswordByEmail: "SELECT password FROM members WHERE email = ",
        getMemberByEmail: "SELECT * FROM members WHERE email = ",
        getIdByCode: "SELECT id FROM members WHERE code = ",
        getIdCodeById: "SELECT id, code FROM members where id = ",
        userList: "select member_users.member_user_id, members.name, members.email, members.phone, members.image, members.dob, members.city, members.gender, member_users.creaeted_at, members.point from member_users join members on members.id = member_users.member_user_id where member_users.member_id = ",
        countMember: "SELECT COUNT(*) as rowcount FROM members where id = ",
        countByEmail: "SELECT COUNT(*) as emailExist FROM members WHERE email = ",
        update: "UPDATE members SET ? where id = " + id,
        updatePassword: "UPDATE members SET ? WHERE id = " + id,
        updateImage: "UPDATE members SET ? WHERE id = " + id
    }
    let log_points = {
        getOrderNumberByPhone: "SELECT order_number FROM log_points WHERE customer_phone = ",
        insert: "INSERT INTO log_points (order_number, customer_phone, price_total) VALUES ",
        getPointsByPhone: "SELECT point FROM members WHERE phone = ",
        updatePoints: "UPDATE members SET ?  WHERE phone = " + id
    }
    let products = {
        get: "SELECT * FROM log_shares",
        insert: "INSERT INTO log_shares SET created_at = now(), ?",
        getByMemberId: "SELECT * FROM log_shares where member_id = "
    }
    let middleware = {
        insert : "INSERT INTO orders SET ?"
    }

    return ({ members, log_points, products, middleware })
}

module.exports = {
    CMS: CMS,
    SAHABAT: SAHABAT
};