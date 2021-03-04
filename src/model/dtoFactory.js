'use strict';

const PersonDTO = require('./personDTO');
const CompetenceProfileDTO=require('./competenceProfileDTO');
const CompetenceDTO = require('./competenceDTO');
const ApplicationDTO=require('./applicationDTO');
const CompetenceTranslationDTO=require('./competenceTranslationDTO');

/**
 * This class is responsible for creating DTOs
 */
class DtoFactory{

    /**
     * Creates a person DTO
     * @param  {object} personModel The model representing the person from the database.
     * @return {object} The person DTO.
     */
    createPersonDto(personModel) {
        return new PersonDTO(
            personModel.person_id,
            personModel.name,
            personModel.surname,
            personModel.ssn,
            personModel.email,
            personModel.password,
            personModel.role_id,
            personModel.username,
            personModel.competence_profiles&&personModel.competence_profiles.map(competenceProfileModel=>this.createCompetenceProfileDto(competenceProfileModel))
        );
    }

    /**
     * Creates an application DTO
     * @param {object} applicationModel The model representing an application.
     * @return {object} The application DTO. 
     */
    createApplicationDto(applicationModel){
        return new ApplicationDTO(
            applicationModel.availability_id,
            applicationModel.from_date,
            applicationModel.to_date,
            applicationModel.createdAt,
            applicationModel.application_status,
            applicationModel.version_number,
            this.createPersonDto(applicationModel.person)
        );
    }

    /**
     * Creates a competence profile DTO
     * @param {object} competenceProfileModel The model representing a competence profile.
     * @return {object} The competence profile DTO.
     */
    createCompetenceProfileDto(competenceProfileModel){
        return new CompetenceProfileDTO(
            competenceProfileModel.competence_profile_id,
            competenceProfileModel.person_id,
            competenceProfileModel.competence_id,
            competenceProfileModel.years_of_experience,
            this.createCompetenceDto(competenceProfileModel.competence)
        );
    }

    /**
     * Creates an array of applications with relevant data included.
     * @param {object} applicationArrayModel The model representing the array of return objects.
     * @return {Array} The application array.
     */
    createApplicationArray(applicationArrayModel){
        return applicationArrayModel.map(applicationModel=>this.createApplicationDto(applicationModel));
    }

    /**
     * Creates a competence DTO
     * @param {object} competenceModel The model representing the competence from the database.
     * @return {object} The competence DTO. 
     */
    createCompetenceDto(competenceModel){
        return new CompetenceDTO(
            competenceModel.competence_id,
            competenceModel.competence_translations&&competenceModel.competence_translations.map(competenceTranslationModel=>this.createCompetenceTranslationDto(competenceTranslationModel))
        );
    }

    /**
     * Creates a competence translation DTO
     * @param {object} competenceTranslationModel The model representing the competence translation from the database.
     * @return {object} The competence translation DTO. 
     */
    createCompetenceTranslationDto(competenceTranslationModel){
        return new CompetenceTranslationDTO(
            competenceTranslationModel.translation_id,
            competenceTranslationModel.competence_id,
            competenceTranslationModel.language,
            competenceTranslationModel.translation,
        );
    }

    /**
     * Creates an array of competences with their competence translation included.
     * @param {object} competenceArrayModel The model representing the array of return objects.
     * @return {Array} The competence array.
     */
    createCompetenceArray(competenceArrayModel){
        return competenceArrayModel.map(competenceModel=>this.createCompetenceDto(competenceModel));
    }
}

const dtoFactory=new DtoFactory();

module.exports=dtoFactory;