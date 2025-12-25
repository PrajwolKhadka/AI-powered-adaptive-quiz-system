import { SchoolRepository } from "../repositories/school.repository";

export const AdminService = {
    getUnverifiedSchools() {
        return SchoolRepository.findUnverified();
    },
    getVerifiedSchools() {
        return SchoolRepository.findVerified();
    },
    verifySchool(id: string) {
        return SchoolRepository.verifyById(id);
    },

    rejectSchool(id: string) {
        return SchoolRepository.rejectById(id);
    }
}