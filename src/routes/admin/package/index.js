const router = require('express').Router();
const PackageController = require('../../../controllers/admin/package');

router.route('/create-package').get(PackageController.postCreatePackage);
router.route('/create').get(PackageController.postCreate);

module.exports = router;
