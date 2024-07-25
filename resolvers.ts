import Article from "./models/article.model";

export const resolvers = {
    Query: {
        hello: () => {
            return "Hello World!";
        },
        getListArticle: async () => {
            const articles = await Article.find({
                deleted: false,
            });

            return articles;
        },
        getArticle: async (_, args) => {
            //! ở đây cs 2 tham số nhưng 1 cái k dùng thì để dấu _, còn cái arguments đó là các cái key bên FE gửi lên
            const { id } = args; //! dùng phá vở cấu trúc để lấy, hoặc lấy bằng cách khác cx đc
            const article = await Article.findOne({
                _id: id,
                deleted: false,
            });

            return article;
        },
    },
};
