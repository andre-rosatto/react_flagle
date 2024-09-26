import { useEffect, useState } from "react";
import useFetch from "./hooks/useFetch";
import { ICountry, isAPIDataList } from "./typings/types.d";

const MAX_GUESSES = 5;

function App() {
	const { data, error, pending } = useFetch('https://restcountries.com/v3.1/independent');
	const [countries, setCountries] = useState<Array<ICountry>>([]);
	const [countryIdx, setCountryIdx] = useState<number>(0);
	const [guesses, setGuesses] = useState<Array<string>>([]);
	const [guess, setGuess] = useState<string>('');

	useEffect(() => {
		if (isAPIDataList(data)) {
			setCountries(data.map(d => {
				return {
					name: d.name.common,
					flag: d.flags.svg,
					capital: d.capital,
					languages: Object.entries(d.languages).map(lang => lang[1]).join(', '),
					currency: Object.entries(d.currencies)[0][1].symbol,
					population: d.population,
					trafficSide: d.car.side,
					continents: d.continents.join(', '),
					googleMaps: d.maps.googleMaps
				}
			}));
			setCountryIdx(Math.floor(Math.random() * data.length));
		}
	}, [data]);

	const handleGuessClick = () => {
		setGuesses([...guesses, guess]);
	}

	const getHearts = (): Array<JSX.Element> => {
		return Array.from(Array(MAX_GUESSES - 1), (_, idx) => 
			MAX_GUESSES - idx > guesses.length + 1
				? <svg key={idx} className="size-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
						<path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
					</svg>
				: <svg key={idx} className="size-5 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
					</svg>
		);
	}

	const getWinStatus = (): '' | 'win' | 'lose' => {
		if (guesses.at(-1) === countries[countryIdx].name) {
			return 'win';
		} else if (guesses.length >= MAX_GUESSES) {
			return 'lose';
		} else {
			return '';
		}
	}	

  return (
		// app
    <>
			{error && <p className="text-red-500">error: { error }</p>}
			{pending && <p className="text-gray-200 text-center">Loading...</p>}

			{/* info window */}
			{!error && !pending && <div className="text-gray-200 flex flex-col items-center">
				{/* title container*/}
				<div className="flex gap-10 items-center mt-2 sm:mt-5 w-full justify-center relative max-w-sm">
					<h1 className="text-2xl font-bold text-center">Who am I?</h1>
					<button className="size-8 bg-red-700 rounded-md px-1 cursor-pointer hover:bg-red-600 absolute right-2">
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z" clipRule="evenodd" />
						</svg>
					</button>
				</div>
				{/* title container end */}

				<div className="flex flex-col max-w-2xl">
					{/* info container */}
					{countries.length > 0 && <div className="flex flex-row gap-4 px-2 py-4">
						{/* flag */}
						<div className="w-28 h-28 sm:w-36 sm:h-36 p-2 flex flex-col justify-between sm:m-0 shadow-md shadow-black bg-gray-700 border border-white rounded-md">
							<img className="aspect-square max-h-20 sm:max-h-24 object-contain" src={countries[countryIdx].flag} alt="flag" />
							<div className="flex bottom-0 left-0 w-full justify-center">{getHearts()}</div>
						</div>
						{/* flag end */}

						{/* info */}
						<div>
							<p className="font-bold">Traffic side: <span className="font-normal capitalize">{ countries[countryIdx].trafficSide }</span></p>
							<p className="font-bold">Currency symbol: <span className="font-normal">{ countries[countryIdx].currency }</span></p>
							{guesses.length > MAX_GUESSES - 5 && <p className="font-bold ">Population: <span className="font-normal">{ countries[countryIdx].population.toString().replace(/\B(?<!\.\d)(?=(\d{3})+(?!\d))/g, ',') }</span></p>}
							{guesses.length > MAX_GUESSES - 4 && <p className="font-bold ">Continents: <span className="font-normal">{ countries[countryIdx].continents }</span></p>}
							{guesses.length > MAX_GUESSES - 3 && <p className="font-bold ">Languages: <span className="font-normal">{ countries[countryIdx].languages }</span></p>}
							{guesses.length > MAX_GUESSES - 2 && <p className="font-bold ">Capital: <span className="font-normal">{ countries[countryIdx].capital }</span></p>}
						</div>
					</div>}
					{/* info container end */}

					{/* end game container */}
					{countries.length > 0 && getWinStatus() && <div className="flex justify-center gap-2">
						<p className="text-2xl font-bold uppercase">{countries[countryIdx].name}</p>
						<a href={countries[countryIdx].googleMaps} target="_blank" rel="noopener noreferrer">
							<svg className="size-8" viewBox="0 0 24 24" fill="currentColor">
								<path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM6.262 6.072a8.25 8.25 0 1 0 10.562-.766 4.5 4.5 0 0 1-1.318 1.357L14.25 7.5l.165.33a.809.809 0 0 1-1.086 1.085l-.604-.302a1.125 1.125 0 0 0-1.298.21l-.132.131c-.439.44-.439 1.152 0 1.591l.296.296c.256.257.622.374.98.314l1.17-.195c.323-.054.654.036.905.245l1.33 1.108c.32.267.46.694.358 1.1a8.7 8.7 0 0 1-2.288 4.04l-.723.724a1.125 1.125 0 0 1-1.298.21l-.153-.076a1.125 1.125 0 0 1-.622-1.006v-1.089c0-.298-.119-.585-.33-.796l-1.347-1.347a1.125 1.125 0 0 1-.21-1.298L9.75 12l-1.64-1.64a6 6 0 0 1-1.676-3.257l-.172-1.03Z" clipRule="evenodd" />
							</svg>
						</a>
					</div>}
					{/* end game container end */}
				</div>
			</div>}
			{/* info window end */}

			{/* guesses container */}
			{countries.length > 0 && <div className="flex flex-col gap-1 items-center px-2 max-w-96 m-auto">
				{/* guesses */}
				{guesses.map(guess =>
					<p key={guess} className="text-gray-200 w-full px-2 border border-gray-200 flex items-center justify-center uppercase">
						{guess}
						{/* wrong guess */}
						{guess !== countries[countryIdx].name && <svg className="size-5 ml-2 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
						</svg>}
						{/* right guess */}
						{guess === countries[countryIdx].name && <svg className="size-5 ml-2 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
						</svg>}
					</p>
				)}
				{/* guesses end */}

				{/* input */}
				{!getWinStatus() && <div className="flex max-w-full px-2 mt-2">
					<select className="rounded-md mr-2 w-full" value={guess} onChange={e => setGuess(e.target.value)}>
						<option value=""></option>
						{countries.filter(country => !guesses.includes(country.name)).map(country => <option value={country.name} key={country.name}>{country.name}</option>)}
					</select>
					<button
						className="disabled:bg-gray-600 disabled:text-gray-500 disabled:cursor-not-allowed bg-green-600 rounded-md text-gray-200 px-4 py-2 font-bold uppercase cursor-pointer hover:bg-green-500 shadow-sm shadow-black"
						disabled={guess === ''}
						onClick={handleGuessClick}
					>Guess</button>
				</div>}
				{/* end input */}
			</div>}
			{/* guesses container end */}
    </>
		// app end
  );
}

export default App;
