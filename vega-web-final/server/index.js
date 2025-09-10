const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// load provider modules
const provider = require('./provider/posts.js');
const metaMod = require('./provider/meta.js');
const streamMod = require('./provider/stream.js');
const catalogMod = require('./provider/catalog.js');
const providerContext = require('./provider/providerContext.js');

// Prepare a providerContext object similar to Vega app
const ctx = providerContext.getProviderContext ? providerContext.getProviderContext() : providerContext.providerContext || {
  axios: require('axios'),
  cheerio: require('cheerio'),
  getBaseUrl: (v)=> process.env.VEGA_BASE_URL || 'https://vegamovies.gmbh',
  commonHeaders: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Accept-Language':'en-IN,en;q=0.9' },
  extractors: {}
};

app.get('/api/catalog', async (req,res)=>{
  try{
    const cat = catalogMod.catalog || (catalogMod.getCatalog && catalogMod.getCatalog());
    res.json({catalog: cat});
  }catch(e){
    res.status(500).json({error:String(e)});
  }
});

app.get('/api/posts', async (req,res)=>{
  const filter = req.query.filter || '/';
  const page = Number(req.query.page||1);
  try{
    const result = await provider.getPosts({ filter, page, providerValue:'vega', signal: null, providerContext: ctx });
    res.json({ page, items: result });
  }catch(e){
    console.error('posts err', e && e.stack || e);
    res.status(500).json({ error: String(e) });
  }
});

app.get('/api/search', async (req,res)=>{
  const q = String(req.query.q || '').trim();
  const page = Number(req.query.page || 1);
  if(!q) return res.status(400).json({error:'Missing q'});
  try{
    if(typeof provider.getSearchPosts === 'function'){
      const result = await provider.getSearchPosts({ searchQuery:q, page, providerValue:'vega', signal:null, providerContext: ctx });
      res.json({ q, page, items: result });
    } else {
      res.status(501).json({ error: 'Search not implemented in provider' });
    }
  }catch(e){
    console.error('search err', e && e.stack || e);
    res.status(500).json({ error: String(e) });
  }
});

app.get('/api/meta', async (req,res)=>{
  const link = String(req.query.link || '').trim();
  if(!link) return res.status(400).json({ error:'Missing link' });
  try{
    const info = await metaMod.getMeta({ link, providerContext: ctx });
    res.json(info);
  }catch(e){
    console.error('meta err', e && e.stack || e);
    res.status(500).json({ error: String(e) });
  }
});

app.get('/api/stream', async (req,res)=>{
  const link = String(req.query.link || '').trim();
  if(!link) return res.status(400).json({ error:'Missing link' });
  try{
    const streams = await streamMod.getStream({ link, type:'', signal:null, providerContext: ctx });
    res.json(streams);
  }catch(e){
    console.error('stream err', e && e.stack || e);
    res.status(500).json({ error: String(e) });
  }
});

// Serve static frontend if built
app.use(express.static(path.join(__dirname,'../client')));

app.listen(PORT, ()=> console.log(`Server running on http://localhost:${PORT}`));
