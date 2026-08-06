export default function StatCard({

    titulo,
    valor,
    icone

}) {

    return (

        <div className="stat-card">

            <div className="stat-icon">

                {icone}

            </div>

            <h2>

                {valor}

            </h2>

            <span>

                {titulo}

            </span>

        </div>

    );

}