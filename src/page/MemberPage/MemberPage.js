function MemberPage() {
    const userInfo = localStorage.getItem('userInfo');
    console.log(userInfo);
    return ( 
        <div>
            {userInfo}
        </div>
     );
}

export default MemberPage;