// Office Dashboard Database Service (Firestore + LocalStorage Fallback)

const MOCK_FAMILIES = [
    {
        id: "FAM-2026-001",
        familyId: "FAM-2026-001",
        headOfFamily: "Joseph D'Souza",
        communityName: "St. Anthony Community - Zone 3",
        address: "B-402, Sacred Heart CHS, Majiwada, Thane (W)",
        contactPhone: "+91 98201 12345",
        email: "joseph.dsouza@example.com",
        joinedDate: "2012-08-15",
        members: [
            {
                id: "mem_01",
                name: "Joseph D'Souza",
                relation: "Head of Family",
                gender: "Male",
                dob: "1978-05-14",
                phone: "+91 98201 12345",
                sacraments: [
                    { name: "Baptism", date: "1978-06-10", parish: "St. John the Baptist Church, Thane", certId: "CERT-BAP-1978-0412" },
                    { name: "First Holy Communion", date: "1987-04-19", parish: "St. John the Baptist Church, Thane", certId: "CERT-FHC-1987-0189" },
                    { name: "Confirmation", date: "1993-11-21", parish: "St. John the Baptist Church, Thane", certId: "CERT-CNF-1993-0304" },
                    { name: "Holy Matrimony", date: "2006-01-08", parish: "Our Lady of Fatima Church, Majiwada", certId: "CERT-MAT-2006-0052" }
                ]
            },
            {
                id: "mem_02",
                name: "Mary D'Souza",
                relation: "Spouse",
                gender: "Female",
                dob: "1982-11-03",
                phone: "+91 98201 54321",
                sacraments: [
                    { name: "Baptism", date: "1982-12-05", parish: "St. Michael Church, Mahim", certId: "CERT-BAP-1982-0881" },
                    { name: "First Holy Communion", date: "1991-05-12", parish: "St. Michael Church, Mahim", certId: "CERT-FHC-1991-0422" },
                    { name: "Confirmation", date: "1997-10-26", parish: "St. Michael Church, Mahim", certId: "CERT-CNF-1997-0915" },
                    { name: "Holy Matrimony", date: "2006-01-08", parish: "Our Lady of Fatima Church, Majiwada", certId: "CERT-MAT-2006-0052" }
                ]
            },
            {
                id: "mem_03",
                name: "Kevin D'Souza",
                relation: "Son",
                gender: "Male",
                dob: "2010-09-22", // Age 16 in 2026 -> Eligible for Confirmation 2026
                phone: "",
                sacraments: [
                    { name: "Baptism", date: "2010-10-19", parish: "Our Lady of Fatima Church, Majiwada", certId: "CERT-BAP-2010-0114" },
                    { name: "First Holy Communion", date: "2019-04-30", parish: "Our Lady of Fatima Church, Majiwada", certId: "CERT-FHC-2019-0518" }
                ]
            },
            {
                id: "mem_04",
                name: "Sarah D'Souza",
                relation: "Daughter",
                gender: "Female",
                dob: "2017-03-18", // Age 9 in 2026 -> Eligible for Communion 2026
                phone: "",
                sacraments: [
                    { name: "Baptism", date: "2017-04-13", parish: "Our Lady of Fatima Church, Majiwada", certId: "CERT-BAP-2017-0677" }
                ]
            }
        ]
    },
    {
        id: "FAM-2026-002",
        familyId: "FAM-2026-002",
        headOfFamily: "Francis Pereira",
        communityName: "St. Joseph Community - Zone 1",
        address: "A-101, Fatima Heights, Majiwada, Thane (W)",
        contactPhone: "+91 98330 99887",
        email: "francis.pereira@example.com",
        joinedDate: "2015-04-10",
        members: [
            {
                id: "mem_05",
                name: "Francis Pereira",
                relation: "Head of Family",
                gender: "Male",
                dob: "1975-02-10",
                phone: "+91 98330 99887",
                sacraments: [
                    { name: "Baptism", date: "1975-03-15", parish: "Our Lady of Fatima Church, Majiwada", certId: "CERT-BAP-1975-0012" },
                    { name: "First Holy Communion", date: "1984-05-10", parish: "Our Lady of Fatima Church, Majiwada", certId: "CERT-FHC-1984-0044" },
                    { name: "Confirmation", date: "1991-11-05", parish: "Our Lady of Fatima Church, Majiwada", certId: "CERT-CNF-1991-0089" },
                    { name: "Holy Matrimony", date: "2005-12-28", parish: "Our Lady of Fatima Church, Majiwada", certId: "CERT-MAT-2005-0102" }
                ]
            },
            {
                id: "mem_06",
                name: "Rita Pereira",
                relation: "Spouse",
                gender: "Female",
                dob: "1980-08-25",
                phone: "+91 98330 99888",
                sacraments: [
                    { name: "Baptism", date: "1980-09-20", parish: "St. Francis Xavier, Kanjurmarg", certId: "CERT-BAP-1980-0221" },
                    { name: "First Holy Communion", date: "1989-04-16", parish: "St. Francis Xavier, Kanjurmarg", certId: "CERT-FHC-1989-0112" },
                    { name: "Confirmation", date: "1996-10-12", parish: "St. Francis Xavier, Kanjurmarg", certId: "CERT-CNF-1996-0331" },
                    { name: "Holy Matrimony", date: "2005-12-28", parish: "Our Lady of Fatima Church, Majiwada", certId: "CERT-MAT-2005-0102" }
                ]
            },
            {
                id: "mem_07",
                name: "Joshua Pereira",
                relation: "Son",
                gender: "Male",
                dob: "2018-06-12", // Age 9 in 2027 -> Eligible for Communion 2027
                phone: "",
                sacraments: [
                    { name: "Baptism", date: "2018-07-08", parish: "Our Lady of Fatima Church, Majiwada", certId: "CERT-BAP-2018-0401" }
                ]
            },
            {
                id: "mem_08",
                name: "Chloe Pereira",
                relation: "Daughter",
                gender: "Female",
                dob: "2011-04-05", // Age 16 in 2027 -> Eligible for Confirmation 2027
                phone: "",
                sacraments: [
                    { name: "Baptism", date: "2011-05-01", parish: "Our Lady of Fatima Church, Majiwada", certId: "CERT-BAP-2011-0210" },
                    { name: "First Holy Communion", date: "2020-02-16", parish: "Our Lady of Fatima Church, Majiwada", certId: "CERT-FHC-2020-0098" }
                ]
            }
        ]
    },
    {
        id: "FAM-2026-003",
        familyId: "FAM-2026-003",
        headOfFamily: "Anthony Fernandes",
        communityName: "Sacred Heart Community - Zone 2",
        address: "C-204, Rosewood Enclave, Majiwada, Thane (W)",
        contactPhone: "+91 97690 11223",
        email: "anthony.f@example.com",
        joinedDate: "2018-01-20",
        members: [
            {
                id: "mem_09",
                name: "Anthony Fernandes",
                relation: "Head of Family",
                gender: "Male",
                dob: "1985-10-15",
                phone: "+91 97690 11223",
                sacraments: [
                    { name: "Baptism", date: "1985-11-10", parish: "St. Jude Church, Malad", certId: "CERT-BAP-1985-0551" },
                    { name: "First Holy Communion", date: "1994-05-01", parish: "St. Jude Church, Malad", certId: "CERT-FHC-1994-0312" },
                    { name: "Confirmation", date: "2001-11-18", parish: "St. Jude Church, Malad", certId: "CERT-CNF-2001-0442" },
                    { name: "Holy Matrimony", date: "2014-02-14", parish: "Our Lady of Fatima Church, Majiwada", certId: "CERT-MAT-2014-0019" }
                ]
            },
            {
                id: "mem_10",
                name: "Maria Fernandes",
                relation: "Spouse",
                gender: "Female",
                dob: "1988-12-01",
                phone: "+91 97690 11224",
                sacraments: [
                    { name: "Baptism", date: "1989-01-08", parish: "Our Lady of Fatima Church, Majiwada", certId: "CERT-BAP-1989-0092" },
                    { name: "First Holy Communion", date: "1997-04-20", parish: "Our Lady of Fatima Church, Majiwada", certId: "CERT-FHC-1997-0104" },
                    { name: "Confirmation", date: "2004-10-31", parish: "Our Lady of Fatima Church, Majiwada", certId: "CERT-CNF-2004-0211" },
                    { name: "Holy Matrimony", date: "2014-02-14", parish: "Our Lady of Fatima Church, Majiwada", certId: "CERT-MAT-2014-0019" }
                ]
            },
            {
                id: "mem_11",
                name: "Ethan Fernandes",
                relation: "Son",
                gender: "Male",
                dob: "2017-10-09", // Age 9 in 2026 -> Eligible for Communion 2026
                phone: "",
                sacraments: [
                    { name: "Baptism", date: "2017-11-05", parish: "Our Lady of Fatima Church, Majiwada", certId: "CERT-BAP-2017-0772" }
                ]
            }
        ]
    }
];

const MOCK_APPROVALS = [
    {
        id: "REQ-2026-001",
        type: "add_member",
        familyId: "FAM-2026-001",
        headName: "Joseph D'Souza",
        requestedBy: "Rita Sharma (Office Member)",
        requestedRole: "office_member",
        timestamp: "2026-08-15 10:30",
        details: {
            memberName: "Anna D'Souza",
            relation: "Mother",
            gender: "Female",
            dob: "1952-04-12",
            phone: "+91 98201 99999",
            sacraments: [
                { name: "Baptism", date: "1952-05-10", parish: "St. John the Baptist Church, Thane" }
            ]
        },
        status: "pending"
    },
    {
        id: "REQ-2026-002",
        type: "certificate_request",
        familyId: "FAM-2026-001",
        headName: "Joseph D'Souza",
        requestedBy: "Rita Sharma (Office Member)",
        requestedRole: "office_member",
        timestamp: "2026-08-16 14:15",
        details: {
            memberName: "Kevin D'Souza",
            sacramentName: "Baptism",
            parishName: "Our Lady of Fatima Church, Majiwada",
            purpose: "School Admission Record"
        },
        status: "pending"
    },
    {
        id: "REQ-2026-003",
        type: "delete_member",
        familyId: "FAM-2026-002",
        headName: "Francis Pereira",
        requestedBy: "Rita Sharma (Office Member)",
        requestedRole: "office_member",
        timestamp: "2026-08-17 11:45",
        details: {
            memberId: "mem_08",
            memberName: "Chloe Pereira",
            reason: "Relocated to abroad university"
        },
        status: "pending"
    },
    {
        id: "REQ-2026-004",
        type: "new_family",
        familyId: "FAM-2026-004",
        headName: "Dominic Lobo",
        requestedBy: "Rita Sharma (Office Member)",
        requestedRole: "office_member",
        timestamp: "2026-08-18 09:20",
        details: {
            familyId: "FAM-2026-004",
            headOfFamily: "Dominic Lobo",
            communityName: "St. Anthony Community - Zone 3",
            address: "D-102, Green Acres, Majiwada, Thane (W)",
            contactPhone: "+91 98110 55443",
            email: "dominic.lobo@example.com",
            membersCount: 3
        },
        status: "pending"
    }
];

const MOCK_STAFF = [
    {
        id: "STAFF-001",
        name: "Fr. Michael D'Costa",
        email: "priest@olfcmajiwada.com",
        role: "admin",
        designation: "Parish Priest",
        status: "active"
    },
    {
        id: "STAFF-002",
        name: "Fr. Paul Rodrigues",
        email: "asst.priest@olfcmajiwada.com",
        role: "admin",
        designation: "Asst. Parish Priest",
        status: "active"
    },
    {
        id: "STAFF-003",
        name: "Rita Sharma",
        email: "rita.office@olfcmajiwada.com",
        role: "office_member",
        designation: "Parish Office Executive",
        status: "active"
    }
];

class OfficeDBService {
    constructor() {
        this.initStorage();
    }

    initStorage() {
        if (!localStorage.getItem('olfc_office_families')) {
            localStorage.setItem('olfc_office_families', JSON.stringify(MOCK_FAMILIES));
        }
        if (!localStorage.getItem('olfc_office_approvals')) {
            localStorage.setItem('olfc_office_approvals', JSON.stringify(MOCK_APPROVALS));
        }
        if (!localStorage.getItem('olfc_office_staff')) {
            localStorage.setItem('olfc_office_staff', JSON.stringify(MOCK_STAFF));
        }
    }

    // Families Methods
    getFamilies() {
        try {
            return JSON.parse(localStorage.getItem('olfc_office_families')) || [];
        } catch (e) {
            return MOCK_FAMILIES;
        }
    }

    saveFamilies(families) {
        localStorage.setItem('olfc_office_families', JSON.stringify(families));
    }

    getFamilyById(familyId) {
        const list = this.getFamilies();
        return list.find(f => f.familyId === familyId || f.id === familyId);
    }

    addFamily(familyData) {
        const list = this.getFamilies();
        if (list.some(f => f.familyId.toLowerCase() === familyData.familyId.toLowerCase())) {
            throw new Error(`Family ID "${familyData.familyId}" already exists. Please use a unique Family ID.`);
        }
        list.push(familyData);
        this.saveFamilies(list);
        return familyData;
    }

    updateFamily(familyId, updatedData) {
        let list = this.getFamilies();
        const index = list.findIndex(f => f.familyId === familyId || f.id === familyId);
        if (index !== -1) {
            list[index] = { ...list[index], ...updatedData };
            this.saveFamilies(list);
            return list[index];
        }
        throw new Error("Family not found");
    }

    deleteFamily(familyId) {
        let list = this.getFamilies();
        list = list.filter(f => f.familyId !== familyId && f.id !== familyId);
        this.saveFamilies(list);
    }

    // Approvals Methods
    getApprovals() {
        try {
            return JSON.parse(localStorage.getItem('olfc_office_approvals')) || [];
        } catch (e) {
            return MOCK_APPROVALS;
        }
    }

    saveApprovals(approvals) {
        localStorage.setItem('olfc_office_approvals', JSON.stringify(approvals));
    }

    addApprovalRequest(reqData) {
        const list = this.getApprovals();
        const newReq = {
            id: `REQ-${Date.now().toString().slice(-6)}`,
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
            status: "pending",
            ...reqData
        };
        list.unshift(newReq);
        this.saveApprovals(list);
        return newReq;
    }

    processApproval(reqId, action, reviewerName = "Admin Priest") {
        const list = this.getApprovals();
        const req = list.find(r => r.id === reqId);
        if (!req) throw new Error("Approval request not found");

        if (action === "approve") {
            req.status = "approved";
            req.reviewedBy = reviewerName;
            req.reviewedAt = new Date().toISOString();

            // Execute automated update on approval
            this.executeApprovedRequest(req);
        } else if (action === "reject") {
            req.status = "rejected";
            req.reviewedBy = reviewerName;
            req.reviewedAt = new Date().toISOString();
        }

        this.saveApprovals(list);
        return req;
    }

    executeApprovedRequest(req) {
        if (req.type === "add_member") {
            const family = this.getFamilyById(req.familyId);
            if (family) {
                const newMember = {
                    id: `mem_${Date.now().toString().slice(-4)}`,
                    name: req.details.memberName,
                    relation: req.details.relation,
                    gender: req.details.gender,
                    dob: req.details.dob,
                    phone: req.details.phone || "",
                    sacraments: req.details.sacraments || []
                };
                family.members = family.members || [];
                family.members.push(newMember);
                this.updateFamily(family.familyId, family);
            }
        } else if (req.type === "delete_member") {
            const family = this.getFamilyById(req.familyId);
            if (family) {
                family.members = family.members.filter(m => m.id !== req.details.memberId && m.name !== req.details.memberName);
                this.updateFamily(family.familyId, family);
            }
        } else if (req.type === "new_family") {
            const newFam = {
                id: req.details.familyId,
                familyId: req.details.familyId,
                headOfFamily: req.details.headOfFamily,
                communityName: req.details.communityName,
                address: req.details.address,
                contactPhone: req.details.contactPhone,
                email: req.details.email || "",
                joinedDate: new Date().toISOString().slice(0, 10),
                members: [
                    {
                        id: `mem_${Date.now().toString().slice(-4)}`,
                        name: req.details.headOfFamily,
                        relation: "Head of Family",
                        gender: "Male",
                        dob: "1980-01-01",
                        sacraments: []
                    }
                ]
            };
            this.addFamily(newFam);
        } else if (req.type === "certificate_request") {
            // Certificate approved: attach certificate ID to member sacrament
            const family = this.getFamilyById(req.familyId);
            if (family) {
                const member = family.members.find(m => m.name === req.details.memberName);
                if (member) {
                    const sac = member.sacraments.find(s => s.name === req.details.sacramentName);
                    if (sac) {
                        sac.certId = `CERT-OFFICIAL-${Date.now().toString().slice(-6)}`;
                        sac.certStatus = "approved";
                    }
                }
                this.updateFamily(family.familyId, family);
            }
        }
    }

    // Staff Methods
    getStaff() {
        try {
            return JSON.parse(localStorage.getItem('olfc_office_staff')) || [];
        } catch (e) {
            return MOCK_STAFF;
        }
    }

    saveStaff(staff) {
        localStorage.setItem('olfc_office_staff', JSON.stringify(staff));
    }

    addStaff(staffMember) {
        const list = this.getStaff();
        const newStaff = {
            id: `STAFF-${Date.now().toString().slice(-4)}`,
            status: "active",
            ...staffMember
        };
        list.push(newStaff);
        this.saveStaff(list);
        return newStaff;
    }

    deleteStaff(staffId) {
        let list = this.getStaff();
        list = list.filter(s => s.id !== staffId);
        this.saveStaff(list);
    }
}

export const officeDB = new OfficeDBService();
