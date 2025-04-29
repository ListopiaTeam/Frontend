import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { readEventLists } from "../utility/crudUtility";
import ListCard from "../components/ListCard";

const ArchivedEventDetails = () => {
  const location = useLocation();
  const eventData = location.state;

  if (!eventData) {
    return <div className="mt-32 text-center">No event data provided.</div>;
  }

  const {
    data: submittedLists = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["archivedSubmittedLists", eventData.id],
    queryFn: async () => {
      if (Array.isArray(eventData.submitedLists) && eventData.submitedLists.length > 0) {
        return await readEventLists(eventData.submitedLists);
      }
      return [];
    },
    enabled: !!eventData.submitedLists?.length,
  });

  if (isLoading) return <div className="mt-32 text-center">Loading...</div>;
  if (error) return <div className="mt-32 text-center text-red-500">Error loading submitted lists.</div>;

  const eventEndDate = new Date(eventData.endDate?.seconds * 1000 || Date.now());

  const listsWithIds = submittedLists.map((list, index) => ({
    ...list,
    listId: eventData.submitedLists[index],
  }));

  const sortedLists = listsWithIds.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
  const topLists = sortedLists.slice(0, 3);
  const remainingLists = sortedLists.slice(3);

  return (
    <main className="mt-32 font-mono flex flex-col justify-center items-center">
      <section className="text-center mb-20">
        <header>
          <h1 className="text-4xl font-semibold text-rose-500 mb-5">
            <span className="text-black">Archived Event:</span> {eventData.title}
          </h1>
        </header>
        <p className="italic mb-3">Description: {eventData.desc}</p>
        <p className="text-gray-600">Ended: {eventEndDate.toDateString()}</p>
      </section>

      {topLists.length > 0 && (
        <section className="container flex flex-col justify-center mx-8 pb-6">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Top 3 Most Liked Lists
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {topLists.map((game) => (
              <article key={game.listId}>
                <ListCard
                  description={game.desc}
                  title={game.title}
                  likes={game.likes}
                  categories={game.categories}
                  url={game.games?.[0]?.background_image}
                  id={game.listId}
                  username={game.username}
                />
              </article>
            ))}
          </div>
          <hr className="h-6 mt-12" />
        </section>
      )}

      {submittedLists.length === 0 ? (
        <footer>
          <p className="text-center text-gray-500 italic pb-12">
            No lists were submitted to this event.
          </p>
        </footer>
      ) : remainingLists.length > 0 ? (
        <section className="container mx-8 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {remainingLists.map((game) => (
              <article key={game.listId}>
                <ListCard
                  description={game.desc}
                  title={game.title}
                  likes={game.likes}
                  categories={game.categories}
                  url={game.games?.[0]?.background_image}
                  id={game.listId}
                  username={game.username}
                />
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
};

export default ArchivedEventDetails;