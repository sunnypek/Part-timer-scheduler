import React from "react";

const Clock = () => {
	return(
		<div>
			Clock page

    <div class="container content">
      <div class="container">
        <h4 class="greeting">Hello!</h4>
        <button
          onclick="createLogin()"
          class="btn btn-outline-primary btn-lg btn-block entryBtn"
        >
          CREATE LOGIN ENTRY
        </button>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th scope="col" class="entries">Logged In (Date, Time)</th>
            <th scope="col" class="entries">Logged Out (Date, Time)</th>
            <th scope="col" class="entries">Duration (hh:mm:ss)</th>
            <th scope="col" class="entries">Timezone</th>
          </tr>
        </thead>

        {/* <tbody>
          <% for(let i = (finalDoc.length-1); i>=0;i--) { %>
          <tr>
            <td class="entries"><%= finalDoc[i].entryDayTime %></td>
            <td class="entries"><%= finalDoc[i].exitDayTime %></td>
            <td class="entries"><%= finalDoc[i].duration %></td>
            <td class="entries"><%= finalDoc[i].entryTimeZone %></td>
          </tr>
          <% } %>
        </tbody> */}
      </table>
    </div>
  </div>
  //   <script>
  //   function createLogin() {
  //     let t = new Date();
  //     console.log(t);
  //     let url = '/logEntry/' + t;
  //     window.location = url;
  //   }
  // </script>


	)
};

export default Clock;

