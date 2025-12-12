export function MyImage () {
    return (
        <img
          src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ14GMq6KWCmk4b1swGN5qB_CMRkfOKOMh_wgaygEnAMG5YwuXjUiItPtqNb-l9pbQ0z1i8k2WC"
          alt = "nature image" 
        />
    );
}

export function Profile(props) {
    return (
        <>
        <p>{props.name}</p>
        <img
            src="https://i.imgur.com/MK3eW3As.jpg"
            alt="Katherine Johnson"
            width={props.size}
            height={props.size}
        />
    </>
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile 
        size = {50}
        name = "Julia"
      />
      <Profile 
        size = {80}
        name = "Jose"
      />
      <Profile 
        size = {100}
        name = "Manny"
      />
    </section>
  );
}

