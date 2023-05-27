class userDTO{
    constructor(userData){
        this._id = userData._id;
        this.name = userData.name;
        this.username = userData.username;
        this.email = userData.email;
    }
}

module.exports = userDTO;