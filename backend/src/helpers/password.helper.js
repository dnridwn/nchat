import bcrypt from 'bcrypt'

const hash = function(password, hashLength) {
    return bcrypt.hashSync(password, hashLength)
}

const compare = function(password, hashPassword) {
    return bcrypt.compareSync(password, hashPassword)
}

export default { hash, compare }