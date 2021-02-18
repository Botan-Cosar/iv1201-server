class HandleLackingData {
  /**
   * Checks whether or not all fields of the user is in the database or not.
   * @param  {object} obj The login object
   * @param  {object} contr The controller.
   * @return {object} The empty fields if any, otherwise returns false.
   */
  static async personNeedsToFillEmptyFields(obj, contr){
    let person;
    if(obj.email)
      person = await contr.findPersonByEmail(obj.email);
    else if(obj.username)
      person = await contr.findPersonByUsername(obj.username);
    else
      return new Error("Could not find person by email or username");
    let emptyFields = {};
    for(var key in person){
      if(person[key] == undefined || person[key] == null){
        emptyFields[key] = true;
      }
    }
    if(Object.keys(emptyFields).length > 0){
      console.log("EMPTY FIELDS: ");
      console.log(emptyFields);
      return emptyFields;
    }
    return false;
  }
}
module.exports = HandleLackingData;
