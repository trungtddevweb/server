import responseHandler from '../handlers/responseHandler.js'
import Voucher from '../models/Voucher.js'
import { optionsPaginate } from '../utils/const.js'

export const createVoucher = async (req, res) => {
    try {
        const { voucherCode, total, startTime, endTime, discount } = req.body
        const existVoucher = await Voucher.findOne({ voucherCode })
        if (existVoucher)
            return responseHandler.badRequest(res, 'Voucher đã tồn tại')

        if (endTime <= startTime) {
            responseHandler.badRequest(
                res,
                'Thời gian kết thúc phải lớn hơn thời gian bắt đầu'
            )
        }

        const newVoucher = await Voucher({
            voucherCode,
            total,
            startTime,
            endTime,
            discount,
        })
        await newVoucher.save()
        responseHandler.created(res, newVoucher)
    } catch (error) {
        responseHandler.error(res, error)
    }
}

export const getAllVoucher = async (req, res) => {
    const { limit, page } = req.query
    try {
        const vouchers = await Voucher.paginate(
            {},
            optionsPaginate(limit, page)
        )
        responseHandler.getData(res, vouchers)
    } catch (error) {
        responseHandler.error(res, error)
    }
}

export const getAVoucher = async (req, res) => {
    const { voucherCode } = req.body

    try {
        const voucher = await Voucher.findOne({ voucherCode })
        if (!voucher)
            return responseHandler.notFound(res, 'Không tìm thấy voucher!')
        if (voucher.expired) {
            return responseHandler.badRequest(res, 'Voucher đã hết hạn!')
        }
        responseHandler.getData(res, voucher)
    } catch (error) {
        responseHandler.error(res, error)
    }
}

export const updatedVoucher = async (req, res) => {
    const voucherId = req.body.id
    const updatedFields = req.body

    try {
        const voucherToUpdate = await Voucher.findById(voucherId)
        if (!voucherToUpdate) {
            return res.status(404).json({
                error: `Không tìm thấy voucher có ID là ${voucherId}`,
            })
        }

        const fieldsToUpdate = Object.keys(updatedFields)
        const updateObject = Object.assign(
            {},
            ...fieldsToUpdate.map((field) => ({
                [field]: updatedFields[field],
            }))
        )

        const updatedVoucher = await Voucher.findByIdAndUpdate(
            voucherId,
            updateObject,
            { new: true }
        )

        return res.status(200).json(updatedVoucher)
    } catch (error) {
        console.error(error)
        responseHandler.error(res, error)
    }
}

export const deletedVoucher = async (req, res) => {
    try {
        const { selectedIds } = req.body
        if (!selectedIds)
            return res.status(400).json({
                status: false,
                message: 'SelectedIds chưa được định nghĩa',
            })
        const checkIds = await Voucher.find({
            _id: {
                $in: selectedIds,
            },
        }).exec()
        const existingIds = checkIds.map((id) => id.id)
        const nonExistingIds = selectedIds.filter(
            (id) => !existingIds.includes(id)
        )
        if (nonExistingIds.length > 0)
            return res.status(404).json({ message: 'Không tìm thấy Voucher' })

        await Voucher.deleteMany({ _id: { $in: selectedIds } })
        res.status(200).json({
            success: true,
            message: 'Danh sách voucher đã bị xóa!',
        })
    } catch (error) {
        responseHandler.error(res, error)
    }
}
