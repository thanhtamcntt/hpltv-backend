const router = require('express').Router();
const { getAllUser } = require('../../../../controllers/admin/manage/user');
const CheckToken = require('../../../../middlewares/checkToken');
const checkRoles = require('../../../../middlewares/checkRoles');

router.route('/').get(CheckToken, getAllUser);

module.exports = router;
