import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { getActiveEvent, readEventLists } from '../utility/crudUtility'
import ListCard from '../components/ListCard'

const EventPage = () => {
  const {data, error, isLoading} = useQuery({
    queryKey: ["activeEvent"],
    queryFn: () => getActiveEvent()
  })

  const {
    data: submittedLists,
    error: submittedError,
    isLoading: submittedLoading,
  } = useQuery({
    queryKey: ["submittedLists"],
    queryFn: async () => {
      if (data && data[0]?.submitedLists && data[0].submitedLists.length > 0) {
        return await readEventLists(data[0].submitedLists);
      } else {
        return [];
      }
    },
    enabled: !!data && data[0]?.submitedLists?.length > 0,
  });
  

  if (isLoading || submittedLoading) return <div>Loading...</div>;
  if (error || submittedError) return <div>Error loading event.</div>;

  const eventEndDate = new Date(data[0]?.endDate.seconds * 1000);
  const currentDate = new Date();

  const timeDifference = eventEndDate - currentDate;
  const daysRemaining = Math.ceil(timeDifference / (1000 * 3600 * 24))

  const topLists = submittedLists
  .sort((a, b) => b.likes - a.likes) 
  .slice(0, 3);

  const remainingLists = submittedLists.filter((list) => !topLists.includes(list));

  return (
    <div className="mt-28 font-mono">
        <div className="text-center mb-20">
            <h1 className="text-4xl font-semibold text-rose-500 mb-5"><span className='text-black'>Event title:</span> {data && data[0].title}</h1>
            <p className='italic mb-3'>Description: {data && data[0].desc}</p>
            <div className="flex items-center justify-center gap-2">
                <span>{daysRemaining} Days Remaining</span>
        </div>
        </div>

        {topLists.length > 0 && (
        <div className="mx-8 pb-6">
          <h2 className="text-2xl font-semibold text-center mb-6">Top 3 Most Liked Lists</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {topLists.map((game, index) => (
              <div key={game.id}>
                <ListCard
                  description={game.desc}
                  title={game.title}
                  likes={game.likes}
                  categories={game.categories}
                  url={game.games[0]?.background_image}
                  id={data && data[0].submitedLists[index]}
                  username={game.username}
                />
              </div>
            ))}
          </div>
        </div>
      )}

        <div className='mx-8 pb-6'>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {remainingLists.map((game, index) => (
              <div key={game.id}>
                   {() => console.log(game)}
                <ListCard
                  description={game.desc}
                  title={game.title}
                  likes={game.likes}
                  categories={game.categories}
                  url={game.games[0]?.background_image}
                  id={data && data[0].submitedLists[index]}
                  username={game.username}
                />
              </div>
            ))}
            </div>
    </div>
    </div>
  )
}

export default EventPage