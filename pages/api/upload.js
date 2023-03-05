import clientPromise from 'lib/clientPromise';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import cheerio from 'cheerio';
const getMetaData = require('metadata-scraper');

export const config = {
  api: {
    bodyParser: false,
  },
};

const post = async (req, res) => {
  const client = await clientPromise;
  const db = client.db('test');
  const form = new formidable.IncomingForm();
  // const uploadFolder = path.join(__dirname, 'public', 'files');
  // console.log('bodiii', form);
  form.parse(req, async function (err, fields, files) {
    // console.log('fields', fields);
    const email = fields.email;
    await saveFile(files.file);
    const filepath = path.join(`./public/${files.file.name}`);
    // console.log('fpfpf', filepath);
    fs.readFile(filepath, 'utf-8', function read(err, data) {
      if (err) {
        throw err;
      }

      const allCollections = [];

      var $ = cheerio.load(data);
      $('a').each(async function (index, a) {
        var $a = $(a);
        var title = $a.text();
        var url = $a.attr('href');
        var categories = getCategories($a);
        const coll = categories[0].toLowerCase();

        if (!allCollections.includes(coll)) {
          allCollections.push(coll);
          const collection = await db
            .collection('collection')
            .insertOne({ email, collection: coll, parent: '' });
        }

        const body = Object.create({ email, collection: coll });
        const metaData = await getMetaData(url);
        body.title = metaData.title;
        body.image = metaData.image;
        body.description = metaData.description;
        body.section = metaData.section;
        body.url = url;
        body.date = new Date().toLocaleDateString();

        const bookmark = await db.collection('bookmarks').insertOne(body);
        // res.status(200).json(bookmark);
      });
    });

    function getCategories($a) {
      var $node = $a.closest('DL').prev();
      var title = $node.text();
      if ($node.length > 0 && title.length > 0) {
        return [title].concat(getCategories($node));
      } else {
        return [];
      }
    }
    return res.status(201).send({ message: 'bookmarks imported' });
  });
};

const saveFile = async (file) => {
  const data = fs.readFileSync(file.path);
  fs.writeFileSync(`./public/${file.name}`, data);

  await fs.unlinkSync(file.path);
  return;
};

export default (req, res) => {
  req.method === 'POST'
    ? post(req, res)
    : req.method === 'PUT'
    ? console.log('PUT')
    : req.method === 'DELETE'
    ? console.log('DELETE')
    : req.method === 'GET'
    ? console.log('GET')
    : res.status(404).send('');
};
