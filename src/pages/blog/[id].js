import moment from "moment";
import mongoose from "mongoose";
import connectMongoose from "../../middleware/mongodb";
import { Blog } from "../../utils/schemas";
import Frame from "../../components/frame";

export default function BlogPage({ name, description, thumbnail, tags, author, createdAt, content }) {
    return <Frame title={name} description={description} image={thumbnail}>
        <div className="p-8 w-full">
            <div className="p-6 shadow-md rounded-lg bg-white w-full border-default border-grey-100">
                <h1 className="text-8xl font-bold">{name}</h1>
                <div className="mt-1">
                    {(tags.length ? tags : ['nil']).map((x, i) => <a className={`font-consolas text-white rounded-sm py-1 px-2 bg-teal-600 hover:bg-teal-500 uppercase font-bold ${i == 0 ? "" : "ml-2"}`} href={`/?tag=${encodeURIComponent(x)}`}>{x}</a>)}
                </div>

                <p className="opacity-80 block mt-1 font-changa text-lg">{description}</p>
                {author ? (
                    <div>
                        <img className="w-5 rounded-full inline-block mr-2 -mt-1" src={author.avatar} alt={author.username}/>
                        <p className="opacity-80 leading-none inline-block">
                            <a className="font-bold hover:underline hover:opacity-100" href={`/member/${author.id}`}>{author.username}</a>・{moment(createdAt).fromNow()}・{getReadTime(content)}
                        </p>
                    </div>
                ) : null}
            </div>
        </div>
    </Frame>
}

BlogPage.getInitialProps = async (ctx) => {
    await connectMongoose();
    const blog = await Blog.findOne({ id: ctx.query.id });
    if (!blog) return { notFound: true };
    return {
        name: blog.name,
        description: blog.description,
        author: mongoose.staffs.get(blog.author),
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt,
        content: blog.content,
        tags: blog.tags,
        id: blog.id,
        thumbnail: blog.thumbnail
    }
}

function getReadTime(content) {
    const d = moment.duration((content.split(' ').length * .2) * 1000);
    const m = Math.round(d.asMinutes());
    if (m == 0) {
        const s = Math.round(d.asSeconds());
        if (s == 0) return "Less than a second read.";
        else return `${s} seconds read.`
    } else return `${m} minutes read.`
}