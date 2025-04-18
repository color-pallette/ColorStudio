using ColorStudio.DataAccess.Interface;
using ColorStudio.DataAccess.Interface.Entities;

public interface IUnitOfWork : IDisposable
{
    IRepository<TEntity> Repository<TEntity>() where TEntity : DataEntity;
    Task<int> SaveChangesAsync();
}
