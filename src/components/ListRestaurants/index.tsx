import axios, { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";
import { IPagination } from "../../interfaces/IPagination";
import IRestaurant from "../../interfaces/IRestaurant";
import style from "./ListRestaurants.module.scss";
import Restaurant from "./Restaurant";

interface IParamsSearch {
  ordering?: string;
  search?: string;
}

const ListRestaurants = () => {
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
  const [nextPage, setNextPage] = useState("");
  const [previousPage, setPreviousPage] = useState("");

  const [seek, setSeek] = useState("");
  const [ordination, setOrdination] = useState("");

  const loadData = (url: string, options: AxiosRequestConfig = {}) => {
    axios
      .get<IPagination<IRestaurant>>(url, options)
      .then((response) => {
        setRestaurants(response.data.results);
        setNextPage(response.data.next);
        setPreviousPage(response.data.previous);
      })
      .catch((erro) => {
        console.log(erro);
      });
  };

  const seeking = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const options = {
      params: {} as IParamsSearch,
    };
    if (seek) {
      options.params.search = seek;
    }
    if (ordination) {
      options.params.ordering = ordination;
    }
    loadData("http://localhost:8000/api/v1/restaurantes/", options);
  };

  useEffect(() => {
    loadData("http://localhost:8000/api/v1/restaurantes/");
  }, []);

  return (
    <section className={style.ListRestaurants}>
      <h1>
        Os restaurantes mais <em>bacanas</em>!
      </h1>
      <form onSubmit={seeking}>
        <div>
          <input
            type="text"
            value={seek}
            onChange={(event) => setSeek(event.target.value)}
          />
        </div>
        <div>
          <button className="search" type="submit">
            <span>Buscar</span>
          </button>
        </div>
      </form>
      {restaurants?.map((item) => (
        <Restaurant restaurant={item} key={item.id} />
      ))}
      {
        <button onClick={() => loadData(previousPage)} disabled={!previousPage}>
          <span>Página Anterior</span>
        </button>
      }
      {
        <button onClick={() => loadData(nextPage)} disabled={!nextPage}>
          <span>Próxima página</span>
        </button>
      }
    </section>
  );
};

export default ListRestaurants;
