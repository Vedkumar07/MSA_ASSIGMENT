import {gql} from "graphql-tag";
export const typeDefs=gql`
type Place{
    name:String!
    address:String!
    rating:Float
    phone:String
}
type Query{
    searchPizzas(lat:Float!,lng:Float!,radius:Int):[Place]
    searchJuices(lat:Float!,lng:Float!,radius:Int):[Place]
    searchCombos(lat:Float!,lng:Float!,radius:Int):[Place]
}`;

