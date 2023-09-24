const responseWithData = (res, statusCode, data) =>
    res.status(statusCode).json(data)

const error = (res, error) => {
    console.log(`==> ${error} <==`)
    responseWithData(res, 500, {
        success: false,
        message: 'Có gì đó sai xót! Vui lòng thử lại',
        error,
    })
}

const badRequest = (res, message) =>
    responseWithData(res, 400, {
        success: false,
        message,
    })

const created = (res, data) => responseWithData(res, 201, data)

const success = (res, data) => responseWithData(res, 200, data)

const getData = (res, data) => responseWithData(res, 200, data)

const unAuthorized = (res) =>
    responseWithData(res, 401, {
        success: false,
        message: 'Không có token',
    })

const tokenNotValid = (res) =>
    responseWithData(res, {
        success: false,
        message: 'Token không hợp lệ',
    })

const forbidden = (res) =>
    responseWithData(res, {
        success: false,
        message: 'Truy cập bị từ chối',
    })

const notFound = (res, message) =>
    responseWithData(res, 404, {
        success: false,
        message,
    })

export default {
    error,
    badRequest,
    created,
    unAuthorized,
    notFound,
    tokenNotValid,
    forbidden,
    getData,
    success,
}
