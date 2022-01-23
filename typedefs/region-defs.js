const { gql } = require('apollo-server');


const typeDefs = gql `
	type Region {
		_id: String!
		owner: String!
        name: String!
        capital: String!
        leader: String!
        parentregion: String!
		landmarks: [String]
        regions: [String]
		sortRule: String!
		sortDirection: Int!
	}
	extend type Query {
		getAllRegions: [Region] 
	}
	extend type Mutation {
		addMap(region: RegionInput!): Region
		addRegion(region: RegionInput!, _id: String!, index: Int!): String
		updateRegionField(_id: String!, field: String!, value: String!): String
		deleteRegion(_id: String!): Boolean
		sortRegions(_id: String!, criteria: String!): [String]
		addLandmark(_id: String!, landmark: String!, index: Int!): [String]
		deleteLandmark(_id: String!, index: Int!): [String]
		editLandmark(_id: String!, landmark: String!, index: Int!): [String]
		changeParent(name: String!, _id: String!, currentParent: String!, user: String!): String
	}
	input RegionInput {
		_id: String
		owner: String
        name: String
        capital: String
        leader: String
        parentregion: String
		landmarks: [String]
        regions: [String]
		sortRule: String!
		sortDirection: Int!
	}
`;

module.exports = { typeDefs: typeDefs }