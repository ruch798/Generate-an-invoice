import Joi from 'joi';
import HttpStatus, { NOT_FOUND } from 'http-status-codes';
import Invoice from './invoice.model';
import invoiceService from './invoice.service';
import userService from '../user/user.service';

export default {
  findAll(req, res, next) {
    const { page = 1, perPage = 10, filter, sortField, sortDir } = req.query;
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(perPage, 10),
      populate: 'client',
    };
    const query = {};
    if (filter) {
      query.item = {
        $regex: filter,
      };
    }
    if (sortField && sortDir) {
      options.sort = {
        [sortField]: sortDir,
      };
    }
    console.log(options);
    Invoice.paginate(query, options)
      .then(invoices => res.json(invoices))
      .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
  },
  create(req, res, next) {
    const schema = Joi.object().keys({
      item: Joi.string().required(),
      date: Joi.date().required(),
      due: Joi.date().required(),
      client: Joi.string().required(),
      qty: Joi.number()
        .integer()
        .required(),
      tax: Joi.number().optional(),
      rate: Joi.number().optional(),
    });
    const { error, value } = Joi.validate(req.body, schema);
    if (error && error.details) {
      return res.status(HttpStatus.BAD_REQUEST).json(error);
    }
    Invoice.create(value)
      .then(invoice => res.json(invoice))
      .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
  },
  findOne(req, res) {
    const { id } = req.params;
    Invoice.findById(id)
      .populate('client')
      .then(invoice => {
        if (!invoice) {
          return res.status(HttpStatus.NOT_FOUND).json({ err: 'Could not find any invoice' });
        }
        return res.json(invoice);
      })
      .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
  },
  delete(req, res) {
    const { id } = req.params;
    Invoice.findByIdAndRemove(id)
      .then(invoice => {
        if (!invoice) {
          return res.status(HttpStatus.NOT_FOUND).json({ err: 'Could not delete any invoice' });
        }
        return res.json(invoice);
      })
      .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
  },
  update(req, res) {
    const { id } = req.params;
    const schema = Joi.object().keys({
      item: Joi.string().optional(),
      date: Joi.date().optional(),
      due: Joi.date().optional(),
      qty: Joi.number()
        .integer()
        .optional(),
      tax: Joi.number().optional(),
      rate: Joi.number().optional(),
      client: Joi.string().optional(),
    });
    const { error, value } = Joi.validate(req.body, schema);
    if (error && error.details) {
      return res.status(HttpStatus.BAD_REQUEST).json(error);
    }
    Invoice.findOneAndUpdate({ _id: id }, value, { new: true })
      .then(invoice => res.json(invoice))
      .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
  },
  async download(req, res) {
    try {
      const { id } = req.params;
      const invoice = await Invoice.findById(id).populate('client');
      if (!invoice) {
        return res.status(NOT_FOUND).send({ err: 'could not find any invice' });
      }
      const { subTotal, total } = invoiceService.getTotal(invoice);
      const user = userService.getUser(req.currentUser);
      const templateBody = invoiceService.getTemplateBody(invoice, subTotal, total, user);
      const html = invoiceService.getInvoiceTemplate(templateBody);
      res.pdfFromHTML({
        filename: `${invoice.item}.pdf`,
        htmlContent: html,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
};
