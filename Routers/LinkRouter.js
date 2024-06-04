import express from 'express'
import LinkController from '../Controllers/LinkController.js'

const LinkRouter = express.Router()

LinkRouter.get('/', LinkController.get)
//  LinkRouter.get('/:id', LinkController.getById)
LinkRouter.get('/:id', (req, res) => {
    LinkController.redirectToOriginalUrl(req, res, req.ip);
});
LinkRouter.post('/', LinkController.add)
LinkRouter.put('/:id', LinkController.update)
LinkRouter.delete('/:id', LinkController.delete)
LinkRouter.get('/:id/clicks', LinkController.getLinkClicks);
export default LinkRouter