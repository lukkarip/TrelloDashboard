using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(TrelloDashboard.Startup))]
namespace TrelloDashboard
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
