const graphql = require('graphql');
const Subcategory = require('../models/subcategory');
const Category = require('../models/category');
const Review = require('../models/review')

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull
} = graphql;



const ReviewType = new GraphQLObjectType({
    name: 'Review',
    fields: () => ({
        id: {type: GraphQLID},
        content: {type: GraphQLString},
        subcategory: {
            type: SubcategoryType,
            resolve(parent, args) {
                return Subcategory.findById(parent.subcategoryId);
            }
        }
    })
})


const SubcategoryType = new GraphQLObjectType({
    name: 'Subcategory',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        category: {
            type: CategoryType,
            resolve(parent, args) {
                return Category.findById(parent.categoryId);
            }
        },
        reviews: {
            type: new GraphQLList(ReviewType),
            resolve(parent, args) {
                return Review.find({subcategoryId: parent.id});
            }
        }
    })
})


const CategoryType = new GraphQLObjectType({
    name: 'Category',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        subcategories: {
            type: new GraphQLList(SubcategoryType),
            resolve(parent, args) {
                return Subcategory.find({categoryId: parent.id});
            }
        }
    })
})




const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        review: {
            type: ReviewType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Review.findById(args.id);
            }
        },
        subcategory: {
            type: SubcategoryType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Subcategory.findById(args.id);
            }
        },
        category: {
            type: CategoryType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Category.findById(args.id);
            }
        },
        reviews: {
            type: new GraphQLList(ReviewType),
            resolve(parent, args) {
                return Review.find({});
            }
        },
        subcategories: {
            type: new GraphQLList(SubcategoryType),
            resolve(parent, args) {
                return Subcategory.find({});
            }
        },
        categories: {
            type: new GraphQLList(CategoryType),
            resolve(parent, args) {
                return Category.find({});
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addReview: {
            type: ReviewType,
            args: {
                content: {type: new GraphQLNonNull(GraphQLString)},
                subcategoryId: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                let review = new Review({
                    content: args.content,
                    subcategoryId: args.subcategoryId
                });
                return review.save();
            }
        },
        addSubcategory: {
            type: SubcategoryType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                categoryId: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                let subcategory = new Subcategory({
                    name: args.name,
                    categoryId: args.categoryId
                });
                return subcategory.save();
            }
        },
        addCategory: {
            type: CategoryType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
                let category = new Category({
                    name: args.name
                });
                return category.save();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
