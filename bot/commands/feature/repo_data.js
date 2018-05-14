const { addFeature }   = require('../feature/feature');

let repoData = [
  {
    repo: '',
    url:'https://api.github.com/repos/Generosity-Market/front_end_POC/projects',
    options: {
      method: 'GET',
      body: ''
    }
  },
  {
    repo: '',
    url:'https://api.github.com/projects/1232164/columns',
    options: {
      method: 'GET',
      body: ''
    }
  },
  {
    repo: '',
    url:'https://api.github.com/projects/columns/2057714/cards',
    options: {
      method: 'POST',
      body: ''
    }
  },
  {
    repo: '!frontend',
    url: 'https://api.github.com/repos/Generosity-Market/front_end_POC/issues',
    options: {
      method: 'POST',
      body: ''
    }
  },
  {
    repo: '!backend',
    url: 'https://api.github.com/repos/Generosity-Market/back_end_POC/issues',
    options: {
      method: 'POST',
      body: ''
    }
  },
  {
    repo: '!api',
    url: 'https://api.github.com/repos/Generosity-Market/api/issues',
    options: {
      method: 'POST',
      body: ''
    }
  },
  {
    repo: '!site',
    url: 'https://api.github.com/repos/Generosity-Market/Generosity-Market.github.io/issues',
    options: {
      method: 'POST',
      body: ''
    }
  },
  {
    repo: '!slackbot',
    url: 'https://api.github.com/repos/JGordy/slackbot/issues',
    options: {
      method: 'POST',
      body: ''
    }
  }
];

function filterRepo(command, args, message) {
  if (args.indexOf('!') !== -1) {

    repoData.forEach((index) => {

      if ((args.includes(index.repo)) && (index.repo !== '')) {

        let description = args.substring(index.repo.length);
        addFeature(command, index, description, message)
      }
    });

  }

}

module.exports = { repoData, filterRepo };
