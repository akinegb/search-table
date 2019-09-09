const errorHandling = (error: any) => console.error('Opps something went wrong...', error);


export const getStarWarsCharacters = () => {
  return fetch("https://swapi.co/api/people/")
    .then(res => res.json())
    .catch(errorHandling);
}

export const pageCharacters = ({page, query}: any) => {
  return fetch(`https://swapi.co/api/people/?page=${page}${query !== undefined?"&search="+query:""}`)
    .then(res => res.json())
    .catch(errorHandling);
}

export const searchCharacters = ({q}: any) => {
  return fetch(`https://swapi.co/api/people/?search=${q}`)
    .then(res => res.json())
    .catch(errorHandling);
}
