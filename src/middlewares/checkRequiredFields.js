export const checkRequiredFields = (fields) => {
    return (req, res, next) => {
        const missingFields = fields.filter((field) => !(field in req.body))
        if (missingFields.length > 0) {
            return res
                .status(400)
                .json({
                    error: `Thiếu các trường bắt buộc: ${missingFields.join(
                        ', '
                    )}`,
                })
        }
        next()
    }
}
